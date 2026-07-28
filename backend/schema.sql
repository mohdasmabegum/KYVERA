-- =====================================================================
-- KYVERA by MRA - Database Collections Schema (MVP)
-- Self-Hosted & On-Premise Enterprise Database DDL
-- Supported Engines: SQLite, PostgreSQL, MySQL
-- =====================================================================

-- 1. EMPLOYEES COLLECTION
CREATE TABLE IF NOT EXISTS Employees (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. LEAVE REQUESTS COLLECTION
CREATE TABLE IF NOT EXISTS LeaveRequests (
    id VARCHAR(50) PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    leave_days INT NOT NULL,
    leave_type VARCHAR(10) CHECK(leave_type IN ('EL', 'CL')),
    priority VARCHAR(20) CHECK(priority IN ('Emergency', 'Important', 'General')),
    purpose TEXT NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP,
    approved_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
    FOREIGN KEY (emp_id) REFERENCES Employees(id)
);

-- 3. MATERIAL REQUESTS COLLECTION
CREATE TABLE IF NOT EXISTS MaterialRequests (
    id VARCHAR(50) PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    material_name VARCHAR(150) NOT NULL,
    quantity VARCHAR(50) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    priority VARCHAR(20) CHECK(priority IN ('Emergency', 'Quick', 'General')),
    availability VARCHAR(50) DEFAULT 'Checking...',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP,
    order_date TIMESTAMP,
    received_date TIMESTAMP,
    handover_date TIMESTAMP,
    accepted_by VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Pending',
    delivery_duration VARCHAR(50),
    FOREIGN KEY (emp_id) REFERENCES Employees(id)
);

-- 4. INVENTORY COLLECTION
CREATE TABLE IF NOT EXISTS Inventory (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    qty INT NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    min_qty INT DEFAULT 5,
    status VARCHAR(30) DEFAULT 'In Stock',
    location VARCHAR(100)
);

-- 5. WORK ASSIGNMENTS COLLECTION
CREATE TABLE IF NOT EXISTS WorkAssignments (
    id VARCHAR(50) PRIMARY KEY,
    assigner_name VARCHAR(100) NOT NULL,
    from_dept VARCHAR(100) NOT NULL,
    to_dept VARCHAR(100) NOT NULL,
    assigned_emp_id VARCHAR(50) NOT NULL,
    assigned_emp_name VARCHAR(100) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    hardware_details TEXT NOT NULL, -- MANDATORY FIELD
    doc_details TEXT NOT NULL,      -- MANDATORY FIELD
    priority VARCHAR(20) CHECK(priority IN ('Emergency', 'Quick', 'General')),
    hardware_confirmed BOOLEAN DEFAULT 0,
    doc_confirmed BOOLEAN DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Assigned',
    progress INT DEFAULT 0,
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    FOREIGN KEY (assigned_emp_id) REFERENCES Employees(id)
);

-- 6. ACTIVITY LOGS COLLECTION
CREATE TABLE IF NOT EXISTS ActivityLogs (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(30) NOT NULL,
    action VARCHAR(100) NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    details TEXT NOT NULL
);

-- 7. DEPARTMENTS COLLECTION
CREATE TABLE IF NOT EXISTS Departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    head_emp_name VARCHAR(100)
);

-- =====================================================================
-- INITIAL SEED DATA
-- =====================================================================

INSERT OR IGNORE INTO Departments (id, name, head_emp_name) VALUES
('DEP-01', 'Executive', 'Dr. Rajesh Varma'),
('DEP-02', 'Human Resources', 'Ananya Sharma'),
('DEP-03', 'Operations', 'Vikram Seth'),
('DEP-04', 'Engineering', 'Arjun Mehta'),
('DEP-05', 'Supply Chain', 'Priya Nair'),
('DEP-06', 'Hardware & Robotics', 'Arjun Mehta');

INSERT OR IGNORE INTO Employees (id, name, role, department, email) VALUES
('MRA-001', 'Dr. Rajesh Varma', 'CEO', 'Executive', 'rajesh@mra.com'),
('MRA-002', 'Ananya Sharma', 'HR', 'Human Resources', 'ananya@mra.com'),
('MRA-003', 'Vikram Seth', 'COORDINATOR', 'Operations', 'vikram@mra.com'),
('MRA-004', 'Arjun Mehta', 'TEAM_LEAD', 'Engineering', 'arjun@mra.com'),
('MRA-005', 'Suresh Kumar', 'EMPLOYEE', 'Engineering', 'suresh@mra.com'),
('MRA-006', 'Priya Nair', 'INVENTORY', 'Supply Chain', 'priya@mra.com');
