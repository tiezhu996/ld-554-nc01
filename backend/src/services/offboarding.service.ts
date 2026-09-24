import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
import { Employee, Shift, Store } from '../models/index.js';
import { EmployeeStatus, ShiftStatus, UserRole } from '../constants/enums.js';
import type { AuthUser } from '../types/request.js';

export interface OffboardingPreview {
  employeeId: number;
  employeeName: string;
  employeeNo: string;
  storeId: number | null;
  isManager: boolean;
  leaveDate: string;
  candidates: Employee[];
  transferableShifts: Shift[];
  checkedInShiftCount: number;
  managedStoreIds: number[];
}

/** 合格接手人：与离职者同店、当前在职（含试用），且不是其本人 */
export async function findHandoverCandidates(employeeId: number) {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });
  if (!employee.storeId) return [];
  return Employee.findAll({
    where: {
      storeId: employee.storeId,
      id: { [Op.ne]: employeeId },
      status: { [Op.ne]: EmployeeStatus.RESIGNED }
    },
    order: [['id', 'ASC']]
  });
}

/** 预览离职影响：候选接手人、待转班次、是否承担店长 */
export async function previewOffboarding(
  employeeId: number,
  leaveDate?: string,
  user?: AuthUser
): Promise<OffboardingPreview> {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });
  if (employee.status === EmployeeStatus.RESIGNED) {
    throw Object.assign(new Error('该员工已是离职状态，无需重复办理'), { status: 400 });
  }
  assertInScope(employee, user);

  const effectiveDate = leaveDate ?? new Date().toISOString().slice(0, 10);
  const candidates = await findHandoverCandidates(employeeId);

  const [transferableShifts, managedStores] = await Promise.all([
    Shift.findAll({
      where: {
        employeeId,
        date: { [Op.gte]: effectiveDate },
        status: { [Op.ne]: ShiftStatus.CHECKED_IN }
      },
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    }),
    Store.findAll({ where: { managerId: employeeId }, attributes: ['id'] })
  ]);

  const checkedInShiftCount = await Shift.count({
    where: { employeeId, date: { [Op.gte]: effectiveDate }, status: ShiftStatus.CHECKED_IN }
  });

  return {
    employeeId: employee.id,
    employeeName: employee.name,
    employeeNo: employee.employeeNo,
    storeId: employee.storeId,
    isManager: managedStores.length > 0,
    leaveDate: effectiveDate,
    candidates,
    transferableShifts,
    checkedInShiftCount,
    managedStoreIds: managedStores.map((store) => store.id)
  };
}

/**
 * 办理离职：在单个事务内原子完成
 * 1. 校验接手人合格；2. 转移尚未打卡的班次；3. 转移门店负责人；4. 更新员工为离职状态。
 * 任一步失败整体回滚，避免状态、班次、门店负责人只改一部分。
 */
export async function resignEmployee(employeeId: number, successorId: number, leaveDate?: string, user?: AuthUser) {
  const employee = await Employee.findByPk(employeeId);
  if (!employee) throw Object.assign(new Error('员工不存在'), { status: 404 });
  if (employee.status === EmployeeStatus.RESIGNED) {
    throw Object.assign(new Error('该员工已是离职状态，无需重复办理'), { status: 400 });
  }
  assertInScope(employee, user);

  if (successorId === employeeId) {
    throw Object.assign(new Error('接手人不能是离职员工本人'), { status: 400 });
  }

  const successor = await Employee.findByPk(successorId);
  if (!successor) throw Object.assign(new Error('接手人不存在'), { status: 400 });
  if (successor.status === EmployeeStatus.RESIGNED) {
    throw Object.assign(new Error('接手人已离职，无法接手，请先调岗或换店后再办理离职'), { status: 400 });
  }
  if (!employee.storeId || successor.storeId !== employee.storeId) {
    throw Object.assign(new Error('没有合格的同店在职接手人，请先调岗或换店后再办理离职'), { status: 400 });
  }

  const effectiveDate = leaveDate ?? new Date().toISOString().slice(0, 10);

  return sequelize.transaction(async (transaction) => {
    // 事务内加锁复查，防止并发期间接手人状态变化
    const lockedSuccessor = await Employee.findByPk(successorId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!lockedSuccessor || lockedSuccessor.status === EmployeeStatus.RESIGNED || lockedSuccessor.storeId !== employee.storeId) {
      throw Object.assign(new Error('没有合格的同店在职接手人，请先调岗或换店后再办理离职'), { status: 400 });
    }

    const [shiftCount] = await Shift.update(
      { employeeId: successorId },
      {
        where: {
          employeeId,
          date: { [Op.gte]: effectiveDate },
          status: { [Op.ne]: ShiftStatus.CHECKED_IN }
        },
        transaction
      }
    );

    const [storeCount] = await Store.update(
      { managerId: successorId },
      { where: { managerId: employeeId }, transaction }
    );

    await employee.update(
      { status: EmployeeStatus.RESIGNED, leaveDate: effectiveDate },
      { transaction }
    );

    return {
      employeeId,
      successorId,
      leaveDate: effectiveDate,
      transferredShiftCount: shiftCount,
      transferredStoreCount: storeCount
    };
  });
}

/** 数据范围：门店经理只能办理本门店员工离职 */
function assertInScope(employee: Employee, user?: AuthUser) {
  if (!user || user.role === UserRole.OWNER) return;
  if (user.role === UserRole.MANAGER && user.storeId && employee.storeId === user.storeId) return;
  throw Object.assign(new Error('无权办理该员工的离职'), { status: 403 });
}
