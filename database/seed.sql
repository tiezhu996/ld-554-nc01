SET NAMES utf8mb4;

INSERT INTO stores (id, name, address, manager_id, status, phone, business_hours) VALUES
(1, '湖滨旗舰店', '杭州市上城区湖滨路 88 号', NULL, 'OPEN', '0571-88000001', '09:00-22:00'),
(2, '城西社区店', '杭州市西湖区文二西路 66 号', NULL, 'OPEN', '0571-88000002', '08:30-21:30'),
(3, '滨江筹备店', '杭州市滨江区江南大道 18 号', NULL, 'RENOVATING', '0571-88000003', '10:00-20:00')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO employees (id, employee_no, name, department, position, phone, email, join_date, status, salary, role, store_id) VALUES
(1, 'EMP-20260101-001', '林青', '经营管理部', '创始人', '13800000001', 'owner@bizstarter.local', '2026-01-01', 'ACTIVE', 28000.00, 'OWNER', 1),
(2, 'EMP-20260201-002', '周然', '门店运营部', '店长', '13800000002', 'manager@bizstarter.local', '2026-02-01', 'ACTIVE', 16000.00, 'MANAGER', 1),
(3, 'EMP-20260312-003', '许安', '门店运营部', '值班主管', '13800000003', 'xuan@bizstarter.local', '2026-03-12', 'ON_PROBATION', 9800.00, 'EMPLOYEE', 1),
(4, 'EMP-20260405-004', '陈禾', '财务部', '会计', '13800000004', 'chenhe@bizstarter.local', '2026-04-05', 'ACTIVE', 12000.00, 'EMPLOYEE', 2)
ON DUPLICATE KEY UPDATE name=VALUES(name);

UPDATE stores SET manager_id = 2 WHERE id = 1;

INSERT INTO users (id, username, password_hash, role, employee_id, store_id) VALUES
(1, 'owner', '$2a$10$.RQRsYByiWZ2lk397nKiQ.NPwxzya/ZnCcTDrg2ySU6lM12iFDGai', 'OWNER', 1, 1),
(2, 'manager', '$2a$10$.RQRsYByiWZ2lk397nKiQ.NPwxzya/ZnCcTDrg2ySU6lM12iFDGai', 'MANAGER', 2, 1),
(3, 'employee', '$2a$10$.RQRsYByiWZ2lk397nKiQ.NPwxzya/ZnCcTDrg2ySU6lM12iFDGai', 'EMPLOYEE', 3, 1)
ON DUPLICATE KEY UPDATE username=VALUES(username);

INSERT INTO permissions (role, module, action) VALUES
('OWNER','employees','create'),('OWNER','employees','read'),('OWNER','employees','update'),('OWNER','employees','delete'),
('MANAGER','employees','create'),('MANAGER','employees','read'),('MANAGER','employees','update'),
('EMPLOYEE','employees','read'),
('OWNER','transactions','create'),('OWNER','transactions','read'),('OWNER','transactions','update'),('OWNER','transactions','delete'),
('MANAGER','transactions','create'),('MANAGER','transactions','read'),
('OWNER','stores','create'),('OWNER','stores','read'),('OWNER','stores','update'),('OWNER','stores','delete'),
('MANAGER','stores','read'),('MANAGER','stores','update');

INSERT INTO shifts (employee_id, date, shift_type, start_time, end_time, store_id, status) VALUES
(2, CURDATE(), 'MORNING', '08:30:00', '13:30:00', 1, 'CHECKED_IN'),
(3, CURDATE(), 'AFTERNOON', '13:30:00', '18:30:00', 1, 'CONFIRMED'),
(4, CURDATE(), 'REST', '00:00:00', '00:00:00', 2, 'PENDING');

INSERT INTO transactions (type, category, amount, description, related_employee_id, store_id, date, receipt, reviewed) VALUES
('INCOME', 'SALES', 28600.00, '湖滨旗舰店日销售收入', NULL, 1, CURDATE(), '/receipts/sales-001.jpg', TRUE),
('EXPENSE', 'SALARY', 9800.00, '试用期员工工资', 3, 1, CURDATE(), '/receipts/salary-003.pdf', FALSE),
('EXPENSE', 'RENT', 18000.00, '城西社区店月租', NULL, 2, CURDATE(), '/receipts/rent-002.pdf', TRUE),
('INCOME', 'SALES', 14600.00, '城西社区店日销售收入', NULL, 2, CURDATE(), '/receipts/sales-002.jpg', TRUE);
