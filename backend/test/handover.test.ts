import assert from 'node:assert';
import { Sequelize } from 'sequelize';
import { Employee, Store, Shift } from '../src/models/index.js';

const sqlite = new Sequelize('sqlite::memory:', { logging: false, define: { underscored: true, timestamps: true } });

Employee.init(Employee.rawAttributes, { sequelize: sqlite, tableName: 'employees' });
Store.init(Store.rawAttributes, { sequelize: sqlite, tableName: 'stores' });
Shift.init(Shift.rawAttributes, { sequelize: sqlite, tableName: 'shifts' });

Store.hasMany(Employee, { foreignKey: 'storeId' });
Employee.belongsTo(Store, { foreignKey: 'storeId' });
Store.belongsTo(Employee, { as: 'manager', foreignKey: 'managerId' });
Employee.hasMany(Store, { as: 'managedStores', foreignKey: 'managerId' });
Employee.hasMany(Shift, { foreignKey: 'employeeId' });
Shift.belongsTo(Employee, { foreignKey: 'employeeId' });
Store.hasMany(Shift, { foreignKey: 'storeId' });
Shift.belongsTo(Store, { foreignKey: 'storeId' });

await sqlite.sync({ force: true });

const { findSuccessors, previewResignation, resignEmployee } = await import('../src/services/handover.service.js');

const today = new Date().toISOString().slice(0, 10);
let seedSeq = 0;

async function seed() {
  seedSeq += 1;
  const n = seedSeq;
  const store = await Store.create({ name: `湖滨店${n}`, address: 'x', phone: 'p', businessHours: '9-22', status: 'OPEN' });
  const store2 = await Store.create({ name: `他店${n}`, address: 'y', phone: 'p', businessHours: '9-22', status: 'OPEN' });
  const manager = await Employee.create({ employeeNo: `M${n}`, name: '店长甲', department: 'd', position: '店长', phone: `1${n}`, email: `a${n}@x`, joinDate: today, status: 'ACTIVE', salary: 1, role: 'MANAGER', storeId: store.id });
  const staff = await Employee.create({ employeeNo: `S${n}a`, name: '店员乙', department: 'd', position: '店员', phone: `2${n}`, email: `b${n}@x`, joinDate: today, status: 'ACTIVE', salary: 1, role: 'EMPLOYEE', storeId: store.id });
  const probie = await Employee.create({ employeeNo: `S${n}b`, name: '试用丙', department: 'd', position: '店员', phone: `3${n}`, email: `c${n}@x`, joinDate: today, status: 'ON_PROBATION', salary: 1, role: 'EMPLOYEE', storeId: store.id });
  const other = await Employee.create({ employeeNo: `O${n}`, name: '他店员', department: 'd', position: '店员', phone: `4${n}`, email: `d${n}@x`, joinDate: today, status: 'ACTIVE', salary: 1, role: 'EMPLOYEE', storeId: store2.id });
  await store.update({ managerId: manager.id });
  return { store, store2, manager, staff, probie, other };
}

let ids = await seed();

// 1. 合格接手人：同店、非离职、非本人（试用也算可接手）
let successors = await findSuccessors(ids.manager.id);
assert.deepStrictEqual(successors.map((s) => s.id).sort(), [ids.staff.id, ids.probie.id], '接手人应为同店在职两人');
console.log('✔ 同店在职员工均可作为接手人（含试用），排除他店与本人');

// 2. 预览：店长标记 + 未来未打卡班次数量
const future = '2099-01-01';
await Shift.create({ employeeId: ids.manager.id, date: future, shiftType: 'MORNING', startTime: '08:00:00', endTime: '13:00:00', storeId: ids.store.id, status: 'PENDING' });
await Shift.create({ employeeId: ids.manager.id, date: future, shiftType: 'NIGHT', startTime: '18:00:00', endTime: '23:00:00', storeId: ids.store.id, status: 'CONFIRMED' });
await Shift.create({ employeeId: ids.manager.id, date: '2000-01-01', shiftType: 'MORNING', startTime: '08:00:00', endTime: '13:00:00', storeId: ids.store.id, status: 'PENDING' });
await Shift.create({ employeeId: ids.manager.id, date: future, shiftType: 'AFTERNOON', startTime: '13:00:00', endTime: '18:00:00', storeId: ids.store.id, status: 'CHECKED_IN' });

const preview = await previewResignation(ids.manager.id, today);
assert.strictEqual(preview.isStoreManager, true);
assert.strictEqual(preview.managedStore?.id, ids.store.id);
assert.strictEqual(preview.pendingShiftCount, 2, '只统计离职日起且未打卡的班次');
assert.strictEqual(preview.hasEligibleSuccessor, true);
console.log('✔ 预览正确识别店长身份与 2 个待交接班次（排除已打卡与离职日前）');

// 3. 正常离职：原子完成 状态+班次+店长
const result = await resignEmployee({ employeeId: ids.manager.id, successorId: ids.staff.id, resignDate: today });
assert.strictEqual(result.status, 'RESIGNED');
assert.strictEqual(result.transferredShiftCount, 2);
assert.strictEqual(result.transferredStoreManager, true);
assert.strictEqual(result.managedStoreId, ids.store.id);

await ids.manager.reload();
await ids.store.reload();
assert.strictEqual(ids.manager.status, 'RESIGNED');
assert.strictEqual(ids.store.managerId, ids.staff.id, '门店负责人应转给接手人');
const transferred = await Shift.findAll({ where: { employeeId: ids.staff.id } });
assert.strictEqual(transferred.length, 2);
const checkedIn = await Shift.findOne({ where: { employeeId: ids.manager.id, status: 'CHECKED_IN' } });
assert.ok(checkedIn, '已打卡班次不转移，保留给离职者');
console.log('✔ 离职成功：员工置为离职、2 个未来未打卡班次转出、店长转交、已打卡班次保留');

// 4. 重复离职被拒
await assert.rejects(() => resignEmployee({ employeeId: ids.manager.id, successorId: ids.staff.id, resignDate: today }), /已离职/);
console.log('✔ 重复办理离职被拒绝');

// 5. 接手人非同店 -> 拒绝
await assert.rejects(() => resignEmployee({ employeeId: ids.probie.id, successorId: ids.other.id, resignDate: today }), /同一门店/);
await ids.probie.reload();
assert.notStrictEqual(ids.probie.status, 'RESIGNED', '失败后员工状态不得变更');
console.log('✔ 接手人非同一门店被拒，员工状态保持不变');

// 6. 接手人是离职员工 -> 拒绝
await assert.rejects(() => resignEmployee({ employeeId: ids.probie.id, successorId: ids.manager.id, resignDate: today }), /离职/);
console.log('✔ 已离职员工不能作为接手人');

// 7. 本人不能接手自己
await assert.rejects(() => resignEmployee({ employeeId: ids.staff.id, successorId: ids.staff.id, resignDate: today }), /本人/);
console.log('✔ 本人不能作为自己的接手人');

// 8. 无合格接手人：预览给出调岗/换店提示
ids = await seed();
const loneStore = await Store.create({ name: '孤岛店', address: 'z', phone: 'p', businessHours: '9-22', status: 'OPEN' });
const lone = await Employee.create({ employeeNo: 'L1', name: '独任店长', department: 'd', position: '店长', phone: '9', email: 'l@x', joinDate: today, status: 'ACTIVE', salary: 1, role: 'MANAGER', storeId: loneStore.id });
await loneStore.update({ managerId: lone.id });
const noPreview = await previewResignation(lone.id, today);
assert.strictEqual(noPreview.hasEligibleSuccessor, false);
assert.match(noPreview.hint ?? '', /调岗|换店/);
assert.strictEqual((await findSuccessors(lone.id)).length, 0);
await assert.rejects(() => resignEmployee({ employeeId: lone.id, successorId: 9999, resignDate: today }), /不存在|门店|离职/);
await lone.reload();
assert.strictEqual(lone.status, 'ACTIVE', '无接手人时离职不得部分生效');
await loneStore.reload();
assert.strictEqual(loneStore.managerId, lone.id, '门店负责人不得变动');
console.log('✔ 无合格接手人：预览提示先调岗/换店，办理被拒且无任何部分修改');

// 9. 原子性：事务最后一步抛错时，班次与店长的修改必须整体回滚，不留半成品
ids = await seed();
await Shift.create({ employeeId: ids.manager.id, date: future, shiftType: 'MORNING', startTime: '08:00:00', endTime: '13:00:00', storeId: ids.store.id, status: 'PENDING' });
const originalSave = Employee.prototype.save;
let failed = false;
Employee.prototype.save = function patchedSave(...args: unknown[]) {
  if (!failed && this.id === ids.manager.id && this.status === 'RESIGNED') {
    failed = true;
    throw new Error('模拟员工状态落库失败');
  }
  return originalSave.apply(this, args as never);
};
await assert.rejects(
  () => resignEmployee({ employeeId: ids.manager.id, successorId: ids.staff.id, resignDate: today }),
  /模拟员工状态落库失败/
);
Employee.prototype.save = originalSave;
await ids.manager.reload();
await ids.store.reload();
assert.strictEqual(ids.manager.status, 'ACTIVE', '回滚后员工仍是在职');
assert.strictEqual(ids.store.managerId, ids.manager.id, '回滚后店长仍是原员工');
const stillOnManager = await Shift.count({ where: { employeeId: ids.manager.id, status: 'PENDING' } });
assert.strictEqual(stillOnManager, 1, '回滚后班次仍属于原员工');
const onStaff = await Shift.count({ where: { employeeId: ids.staff.id } });
assert.strictEqual(onStaff, 0, '回滚后接手人名下不应出现班次');
console.log('✔ 事务原子性：末步失败时状态/班次/店长全部回滚，不存在只改一部分');

console.log('✔ 全部 9 组用例通过');
