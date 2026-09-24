import { Op } from 'sequelize';
import { Employee, Shift, Store } from '../models/index.js';
import { EmployeeStatus } from '../constants/enums.js';
import type { Employee as EmployeeModel } from '../models/employee.model.js';

const NOT_CHECKED_IN = { [Op.ne]: 'CHECKED_IN' } as const;

function fail(message: string, status = 400, code?: string) {
  return Object.assign(new Error(message), { status, code });
}

async function findEmployee(id: number) {
  const employee = await Employee.findByPk(id);
  if (!employee) throw fail('员工不存在', 404, 'EMPLOYEE_NOT_FOUND');
  return employee;
}

/**
 * 查找一名员工离职时的合格接手人：同店、在职（非离职）、且不是本人。
 */
export async function findSuccessors(employeeId: number): Promise<EmployeeModel[]> {
  const employee = await findEmployee(employeeId);
  if (!employee.storeId) return [];
  return Employee.findAll({
    where: {
      storeId: employee.storeId,
      id: { [Op.ne]: employee.id },
      status: { [Op.ne]: EmployeeStatus.RESIGNED }
    },
    order: [['id', 'ASC']]
  });
}

/**
 * 离职办理前的预检/预览：返回可接手人、待交接的未来班次与是否需要交接店长。
 * 前端据此渲染办理窗口；无可接手人时给出“先调岗或换店”的引导。
 */
export async function previewResignation(employeeId: number, resignDate?: string) {
  const employee = await findEmployee(employeeId);
  if (employee.status === EmployeeStatus.RESIGNED) {
    throw fail('该员工已离职，无需重复办理', 409, 'ALREADY_RESIGNED');
  }

  const effectiveDate = resignDate ?? new Date().toISOString().slice(0, 10);
  const successors = await findSuccessors(employeeId);
  const managedStore = await Store.findOne({ where: { managerId: employee.id } });
  const pendingShifts = await Shift.findAll({
    where: { employeeId: employee.id, date: { [Op.gte]: effectiveDate }, status: NOT_CHECKED_IN },
    order: [['date', 'ASC'], ['startTime', 'ASC']]
  });

  return {
    employee: { id: employee.id, name: employee.name, employeeNo: employee.employeeNo, storeId: employee.storeId },
    resignDate: effectiveDate,
    isStoreManager: Boolean(managedStore),
    managedStore: managedStore ? { id: managedStore.id, name: managedStore.name } : null,
    pendingShiftCount: pendingShifts.length,
    pendingShifts,
    successors: successors.map((item) => ({
      id: item.id,
      name: item.name,
      employeeNo: item.employeeNo,
      position: item.position,
      status: item.status
    })),
    hasEligibleSuccessor: successors.length > 0,
    hint: successors.length === 0 ? '该员工所在门店没有其他在职员工可接手，请先为门店调岗或换店后再办理离职' : null
  };
}

/**
 * 办理离职（单事务、原子提交）：
 * 1. 校验存在合格接手人（同店在职、非本人）；
 * 2. 离职当日起尚未打卡的班次转给接手人；
 * 3. 若离职者是店长，门店负责人转给接手人；
 * 4. 员工状态置为离职。
 * 任一步失败整体回滚，员工状态、班次、门店负责人不会只改一部分。
 */
export async function resignEmployee(input: { employeeId: number; successorId: number; resignDate?: string }) {
  const employee = await findEmployee(input.employeeId);
  if (employee.status === EmployeeStatus.RESIGNED) {
    throw fail('该员工已离职，无需重复办理', 409, 'ALREADY_RESIGNED');
  }
  if (input.successorId === employee.id) {
    throw fail('接手人不能是离职员工本人', 400, 'INVALID_SUCCESSOR');
  }

  const effectiveDate = input.resignDate ?? new Date().toISOString().slice(0, 10);
  const sequelize = Employee.sequelize;
  if (!sequelize) throw fail('数据库未初始化', 500, 'NO_SEQUELIZE');

  return sequelize.transaction(async (transaction) => {
    const successor = await Employee.findByPk(input.successorId, { transaction });
    if (!successor) throw fail('接手人员工不存在', 404, 'SUCCESSOR_NOT_FOUND');
    if (!employee.storeId || successor.storeId !== employee.storeId) {
      throw fail('接手人必须与离职员工属于同一门店，请先调岗或换店', 400, 'SUCCESSOR_STORE_MISMATCH');
    }
    if (successor.status === EmployeeStatus.RESIGNED) {
      throw fail('接手人已处于离职状态，请选择在职员工接手', 400, 'SUCCESSOR_RESIGNED');
    }

    const [affectedCount] = await Shift.update(
      { employeeId: successor.id },
      {
        where: { employeeId: employee.id, date: { [Op.gte]: effectiveDate }, status: NOT_CHECKED_IN },
        transaction
      }
    );
    const transferredShiftCount = affectedCount;

    const managedStore = await Store.findOne({ where: { managerId: employee.id }, transaction });
    if (managedStore) {
      managedStore.managerId = successor.id;
      await managedStore.save({ transaction });
    }

    employee.status = EmployeeStatus.RESIGNED;
    await employee.save({ transaction });

    return {
      employeeId: employee.id,
      status: employee.status,
      successorId: successor.id,
      transferredShiftCount,
      transferredStoreManager: Boolean(managedStore),
      managedStoreId: managedStore?.id ?? null,
      resignDate: effectiveDate
    };
  });
}
