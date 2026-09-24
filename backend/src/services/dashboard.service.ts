import { fn, col, literal } from 'sequelize';
import { Employee, Shift, Store, Transaction } from '../models/index.js';
import { EmployeeStatus, TransactionType } from '../constants/enums.js';

export async function getDashboardSummary() {
  const [employeeCount, activeEmployees, pendingShifts, pendingTransactions] = await Promise.all([
    Employee.count(),
    Employee.count({ where: { status: EmployeeStatus.ACTIVE } }),
    Shift.count({ where: { status: 'PENDING' } }),
    Transaction.count({ where: { reviewed: false } })
  ]);

  const monthlyFinance = await Transaction.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'month'],
      'type',
      [fn('SUM', col('amount')), 'amount']
    ],
    group: ['type', fn('DATE_FORMAT', col('date'), '%Y-%m')],
    raw: true
  });

  const topStores = await Transaction.findAll({
    attributes: ['storeId', [fn('SUM', col('amount')), 'revenue']],
    where: { type: TransactionType.INCOME },
    include: [Store],
    group: ['storeId'],
    order: [[literal('revenue'), 'DESC']],
    limit: 5
  });

  return {
    metrics: { employeeCount, activeEmployees, pendingShifts, pendingTransactions },
    monthlyFinance,
    topStores,
    attendance: { checkedIn: await Shift.count({ where: { status: 'CHECKED_IN' } }), total: await Shift.count() },
    todos: [
      { title: '待确认排班', count: pendingShifts },
      { title: '待审核财务记录', count: pendingTransactions },
      { title: '试用期员工', count: await Employee.count({ where: { status: EmployeeStatus.ON_PROBATION } }) }
    ]
  };
}
