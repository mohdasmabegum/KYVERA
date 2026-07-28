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

-- 2. LEAVE APPLICATION SHEET (11 Database Fields as Specified)
CREATE TABLE IF NOT EXISTS LeaveRequests (
    emp_id VARCHAR(50) NOT NULL,
    emp_name VARCHAR(100) NOT NULL,
    date_applied DATE NOT NULL,
    from_to_dates VARCHAR(100) NOT NULL,
    contact_number VARCHAR(30) NOT NULL,
    no_of_days INT NOT NULL,
    type_of_request VARCHAR(50) NOT NULL, -- (EL/CL, Emergency/Important/General)
    approved_by VARCHAR(100),
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_date TIMESTAMP,
    dept VARCHAR(100) NOT NULL,
    PRIMARY KEY (emp_id, applied_date),
    FOREIGN KEY (emp_id) REFERENCES Employees(id)
);

-- 3. MATERIAL REQUEST SHEET (18 Database Fields as Specified)
CREATE TABLE IF NOT EXISTS MaterialRequests (
    emp_name VARCHAR(100) NOT NULL,
    emp_id VARCHAR(50) NOT NULL,
    type_of_material_needed VARCHAR(150) NOT NULL,
    no_of_units_or_length VARCHAR(50) NOT NULL,
    available_at_moment VARCHAR(50) DEFAULT 'Checking...',
    accepted_rejected_by_inventory VARCHAR(100),
    provided_from_available_or_delayed VARCHAR(50),
    order_placed_status VARCHAR(50),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reached_date TIMESTAMP,
    accepted_date TIMESTAMP,
    provided_date TIMESTAMP,
    not_available_order_placed_date TIMESTAMP,
    order_received_date TIMESTAMP,
    no_of_days_to_receive_order INT,
    provided_date_final TIMESTAMP,
    no_of_days_for_providing_material INT,
    updates_material_received VARCHAR(50) DEFAULT 'Pending',
    PRIMARY KEY (emp_id, request_date),
    FOREIGN KEY (emp_id) REFERENCES Employees(id)
);

-- 4. INVENTORY CATALOG & TO-DO REMINDER SHEET
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

-- 5. WORK LOGS SHEET (Work Alloter & Receiver Info)
CREATE TABLE IF NOT EXISTS WorkAssignments (
    id VARCHAR(50) PRIMARY KEY,
    alloter_emp_name VARCHAR(100) NOT NULL,
    from_dept VARCHAR(100) NOT NULL,
    to_dept VARCHAR(100) NOT NULL,
    assigned_emp_id VARCHAR(50) NOT NULL,
    assigned_emp_name VARCHAR(100) NOT NULL,
    project_name VARCHAR(150) NOT NULL,
    hardware_info TEXT NOT NULL, -- MANDATORY FIELD
    doc_info TEXT NOT NULL,      -- MANDATORY FIELD
    requirement_type VARCHAR(20) CHECK(requirement_type IN ('Emergency', 'Quick', 'General')),
    hardware_confirmed BOOLEAN DEFAULT 0,
    doc_confirmed BOOLEAN DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Assigned',
    progress INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP,
    FOREIGN KEY (assigned_emp_id) REFERENCES Employees(id)
);

-- 6. ACTIVITY LOGS SHEET
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

-- 7. DEPARTMENTS SHEET
CREATE TABLE IF NOT EXISTS Departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    head_emp_name VARCHAR(100)
);

-- INITIAL SEED DATA
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
