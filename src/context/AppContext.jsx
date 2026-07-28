import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  TEAM_LEAD: { id: 'TEAM_LEAD', title: 'Team Lead / Sub-TL', name: 'Arjun Mehta', empId: 'MRA-004', dept: 'Engineering' },
  INVENTORY: { id: 'INVENTORY', title: 'Inventory Manager', name: 'Priya Nair', empId: 'MRA-006', dept: 'Supply Chain' },
  EMPLOYEE: { id: 'EMPLOYEE', title: 'Normal Employee', name: 'Suresh Kumar', empId: 'MRA-005', dept: 'Engineering' },
  COORDINATOR: { id: 'COORDINATOR', title: 'Project Coordinator', name: 'Vikram Seth', empId: 'MRA-003', dept: 'Operations' },
  CEO: { id: 'CEO', title: 'CEO / Founder / Director', name: 'Dr. Rajesh Varma', empId: 'MRA-001', dept: 'Executive' },
  HR: { id: 'HR', title: 'HR Manager', name: 'Ananya Sharma', empId: 'MRA-002', dept: 'Human Resources' },
};

const INITIAL_DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Supply Chain',
  'Operations',
  'Quality Assurance',
  'Hardware & Robotics',
  'Executive'
];

const INITIAL_EMPLOYEES = [
  { id: 'MRA-001', name: 'Dr. Rajesh Varma', role: 'CEO', dept: 'Executive', email: 'ceo@mra.kyvera.com', leaveBalance: { EL: 12, CL: 8 }, onLeave: false },
  { id: 'MRA-002', name: 'Ananya Sharma', role: 'HR', dept: 'Human Resources', email: 'hr@mra.kyvera.com', leaveBalance: { EL: 14, CL: 6 }, onLeave: false },
  { id: 'MRA-003', name: 'Vikram Seth', role: 'COORDINATOR', dept: 'Operations', email: 'coordinator@mra.kyvera.com', leaveBalance: { EL: 10, CL: 10 }, onLeave: false },
  { id: 'MRA-004', name: 'Arjun Mehta', role: 'TEAM_LEAD', dept: 'Engineering', email: 'tl@mra.kyvera.com', leaveBalance: { EL: 15, CL: 5 }, onLeave: false },
  { id: 'MRA-005', name: 'Suresh Kumar', role: 'EMPLOYEE', dept: 'Engineering', email: 'suresh@mra.kyvera.com', leaveBalance: { EL: 11, CL: 7 }, onLeave: false },
  { id: 'MRA-006', name: 'Priya Nair', role: 'INVENTORY', dept: 'Supply Chain', email: 'inventory@mra.kyvera.com', leaveBalance: { EL: 13, CL: 9 }, onLeave: false }
];

const INITIAL_INVENTORY = [
  { id: 'INV-101', name: 'Microcontroller Dev Boards (STM32)', category: 'Hardware', qty: 45, unit: 'pcs', minQty: 10, status: 'In Stock', location: 'Rack A-3' },
  { id: 'INV-102', name: 'Industrial Fiber Cables', category: 'Cables', qty: 120, unit: 'meters', minQty: 50, status: 'In Stock', location: 'Rack B-1' },
  { id: 'INV-103', name: 'High-Precision Stepper Motors', category: 'Actuators', qty: 8, unit: 'pcs', minQty: 15, status: 'Low Stock', location: 'Rack C-2' },
  { id: 'INV-104', name: 'DIN-Rail Power Supply 24V 10A', category: 'Power', qty: 0, unit: 'pcs', minQty: 5, status: 'Out of Stock', location: 'Rack D-4' }
];

const INITIAL_LEAVES = [
  {
    id: 'LV-2026-001',
    empId: 'MRA-005',
    empName: 'Suresh Kumar',
    dept: 'Engineering',
    fromDate: '2026-08-01',
    toDate: '2026-08-03',
    leaveDays: 3,
    leaveType: 'EL',
    priority: 'General',
    purpose: 'Personal family event in native town',
    contactNumber: '+91 98765 43210',
    appliedDate: '2026-07-27 10:30 AM',
    approvedDate: '2026-07-27 02:15 PM',
    approvedBy: 'Ananya Sharma (HR)',
    status: 'Approved'
  },
  {
    id: 'LV-2026-002',
    empId: 'MRA-004',
    empName: 'Arjun Mehta',
    dept: 'Engineering',
    fromDate: '2026-08-05',
    toDate: '2026-08-06',
    leaveDays: 2,
    leaveType: 'CL',
    priority: 'Emergency',
    purpose: 'Medical emergency checkup',
    contactNumber: '+91 91234 56789',
    appliedDate: '2026-07-28 09:15 AM',
    approvedDate: null,
    approvedBy: null,
    status: 'Pending'
  }
];

const INITIAL_MATERIAL_REQUESTS = [
  {
    id: 'MAT-2026-001',
    empId: 'MRA-005',
    empName: 'Suresh Kumar',
    dept: 'Engineering',
    materialName: 'Microcontroller Dev Boards (STM32)',
    quantity: '5 pcs',
    projectName: 'KYVERA Automation Module',
    priority: 'Quick',
    availability: 'Available',
    requestDate: '2026-07-28 08:30 AM',
    acceptedDate: '2026-07-28 09:45 AM',
    orderDate: null,
    receivedDate: null,
    handoverDate: '2026-07-28 11:00 AM',
    acceptedBy: 'Priya Nair',
    status: 'Handed Over',
    deliveryDuration: '2 hrs 30 mins'
  },
  {
    id: 'MAT-2026-002',
    empId: 'MRA-004',
    empName: 'Arjun Mehta',
    dept: 'Hardware & Robotics',
    materialName: 'DIN-Rail Power Supply 24V 10A',
    quantity: '2 pcs',
    projectName: 'Robotics Rig Rev-2',
    priority: 'Emergency',
    availability: 'Out of Stock',
    requestDate: '2026-07-28 10:00 AM',
    acceptedDate: '2026-07-28 10:30 AM',
    orderDate: null,
    receivedDate: null,
    handoverDate: null,
    acceptedBy: 'Priya Nair',
    status: 'Pending for Order',
    deliveryDuration: 'Estimated 2 Days'
  }
];

const INITIAL_WORK_ASSIGNMENTS = [
  {
    id: 'WORK-2026-001',
    assignerName: 'Vikram Seth',
    fromDept: 'Operations',
    toDept: 'Engineering',
    assignedEmpId: 'MRA-005',
    assignedEmpName: 'Suresh Kumar',
    projectName: 'KYVERA Core Gateway Integration',
    hardwareDetails: 'Gateway Module Chassis #MRA-HW-889 + Power Harness',
    docDetails: 'Spec Doc v2.4 (PDF) + API Contract Blueprint v1.1',
    priority: 'Emergency',
    hardwareConfirmed: true,
    docConfirmed: true,
    status: 'Accepted',
    materialRequested: false,
    progress: 45,
    assignedDate: '2026-07-27 11:00 AM',
    completedDate: null,
    completionDays: null
  },
  {
    id: 'WORK-2026-002',
    assignerName: 'Arjun Mehta',
    fromDept: 'Engineering',
    toDept: 'Quality Assurance',
    assignedEmpId: 'MRA-005',
    assignedEmpName: 'Suresh Kumar',
    projectName: 'PLC Signal Calibration',
    hardwareDetails: 'Calibration Jig #CJ-04',
    docDetails: 'Test Suite SOP-902',
    priority: 'Quick',
    hardwareConfirmed: false,
    docConfirmed: false,
    status: 'Assigned',
    materialRequested: false,
    progress: 0,
    assignedDate: '2026-07-28 12:30 PM',
    completedDate: null,
    completionDays: null
  },
  {
    id: 'WORK-2026-003',
    assignerName: 'Dr. Rajesh Varma',
    fromDept: 'Executive',
    toDept: 'Engineering',
    assignedEmpId: 'MRA-004',
    assignedEmpName: 'Arjun Mehta',
    projectName: 'Robotics Microcode Optimizations',
    hardwareDetails: 'Robotic Arm Armature #RA-01',
    docDetails: 'Microcode Spec v4.0',
    priority: 'General',
    hardwareConfirmed: true,
    docConfirmed: true,
    status: 'Completed',
    materialRequested: false,
    progress: 100,
    assignedDate: '2026-07-20 09:00 AM',
    completedDate: '2026-07-23 05:00 PM',
    completionDays: 3
  }
];

const INITIAL_ACTIVITY_LOGS = [
  {
    id: 'LOG-001',
    type: 'WORK',
    action: 'Task Assigned',
    empName: 'Suresh Kumar',
    dept: 'Engineering',
    timestamp: '2026-07-28 12:30 PM',
    updatedBy: 'Arjun Mehta',
    status: 'Assigned',
    details: 'Assigned work: PLC Signal Calibration with Hardware & Documentation checks.'
  },
  {
    id: 'LOG-002',
    type: 'MATERIAL',
    action: 'Added to Order To-Do List',
    empName: 'Arjun Mehta',
    dept: 'Hardware & Robotics',
    timestamp: '2026-07-28 11:15 AM',
    updatedBy: 'Priya Nair',
    status: 'Pending for Order',
    details: 'Material DIN-Rail Power Supply 24V 10A is Out of Stock. Added to Inventory To-Do Reminder List.'
  }
];

export const AppProvider = ({ children }) => {
  // Saved Auth User Check
  const [savedUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!savedUser);
  const [currentRoleKey, setCurrentRoleKey] = useState(() => savedUser?.id || 'TEAM_LEAD');
  const [currentUser, setCurrentUser] = useState(() => savedUser || ROLES.TEAM_LEAD);

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('kyvera_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('kyvera_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [materialRequests, setMaterialRequests] = useState(() => {
    const saved = localStorage.getItem('kyvera_material');
    return saved ? JSON.parse(saved) : INITIAL_MATERIAL_REQUESTS;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('kyvera_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [workAssignments, setWorkAssignments] = useState(() => {
    const saved = localStorage.getItem('kyvera_work');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ASSIGNMENTS;
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    const saved = localStorage.getItem('kyvera_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [departments] = useState(INITIAL_DEPARTMENTS);

  const getDefaultTabForRole = (roleKey) => {
    if (roleKey === 'HR') return 'leave';
    if (roleKey === 'INVENTORY') return 'material';
    if (roleKey === 'EMPLOYEE') return 'work';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTabForRole(currentRoleKey));
  const [notificationCount, setNotificationCount] = useState(2);

  // Dynamic Login Handler with Persistence
  const loginAsUser = (email, roleKey) => {
    const foundEmp = employees.find(e => e.email.toLowerCase() === email.toLowerCase());
    const targetRole = roleKey || (foundEmp ? foundEmp.role : 'EMPLOYEE');

    const userObj = {
      id: targetRole,
      title: ROLES[targetRole]?.title || 'Employee Account',
      name: foundEmp ? foundEmp.name : (ROLES[targetRole]?.name || 'User Account'),
      empId: foundEmp ? foundEmp.id : (ROLES[targetRole]?.empId || 'MRA-000'),
      dept: foundEmp ? foundEmp.dept : (ROLES[targetRole]?.dept || 'Operations')
    };

    setCurrentRoleKey(targetRole);
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setActiveTab(getDefaultTabForRole(targetRole));
    localStorage.setItem('kyvera_auth_user', JSON.stringify(userObj));
    return true;
  };

  // Register New User Handler with Persistence
  const registerUser = (userData) => {
    const newEmp = {
      id: userData.empId || `MRA-${Date.now().toString().slice(-4)}`,
      name: userData.name,
      role: userData.role,
      dept: userData.dept,
      email: userData.email,
      leaveBalance: { EL: 12, CL: 8 },
      onLeave: false
    };

    setEmployees(prev => [newEmp, ...prev]);

    const userObj = {
      id: userData.role,
      title: userData.title || 'User Account',
      name: userData.name,
      empId: newEmp.id,
      dept: userData.dept
    };

    setCurrentRoleKey(userData.role);
    setCurrentUser(userObj);
    setIsAuthenticated(true);
    setActiveTab(getDefaultTabForRole(userData.role));
    localStorage.setItem('kyvera_auth_user', JSON.stringify(userObj));
    return newEmp;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kyvera_auth_user');
  };

  // LocalStorage Sync
  useEffect(() => { localStorage.setItem('kyvera_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('kyvera_leaves', JSON.stringify(leaveRequests)); }, [leaveRequests]);
  useEffect(() => { localStorage.setItem('kyvera_material', JSON.stringify(materialRequests)); }, [materialRequests]);
  useEffect(() => { localStorage.setItem('kyvera_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('kyvera_work', JSON.stringify(workAssignments)); }, [workAssignments]);
  useEffect(() => { localStorage.setItem('kyvera_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  // Log action helper
  const addLog = (type, action, empName, dept, updatedBy, status, details) => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      type,
      action,
      empName,
      dept,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      updatedBy,
      status,
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Leave Actions
  const applyLeave = (leaveData) => {
    const id = `LV-2026-${(leaveRequests.length + 1).toString().padStart(3, '0')}`;
    const newLeave = {
      id,
      empId: currentUser.empId,
      empName: currentUser.name,
      dept: currentUser.dept,
      ...leaveData,
      appliedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      approvedDate: null,
      approvedBy: null,
      status: 'Pending'
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    addLog('LEAVE', 'Applied Leave', currentUser.name, currentUser.dept, currentUser.name, 'Pending', `Applied for ${leaveData.leaveDays} days ${leaveData.leaveType} leave.`);
    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, approvedBy) => {
    setLeaveRequests(prev => prev.map(item => {
      if (item.id === leaveId) {
        const updated = {
          ...item,
          status,
          approvedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
          approvedBy: approvedBy || currentUser.name
        };
        addLog('LEAVE', `Leave ${status}`, item.empName, item.dept, currentUser.name, status, `Leave request ${item.id} was marked as ${status}.`);
        return updated;
      }
      return item;
    }));
  };

  // Material Actions
  const submitMaterialRequest = (matData) => {
    const id = `MAT-2026-${(materialRequests.length + 1).toString().padStart(3, '0')}`;
    const newReq = {
      id,
      empId: currentUser.empId,
      empName: currentUser.name,
      dept: currentUser.dept,
      ...matData,
      availability: 'Checking...',
      requestDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      acceptedDate: null,
      orderDate: null,
      receivedDate: null,
      handoverDate: null,
      acceptedBy: null,
      status: 'Pending',
      deliveryDuration: 'Pending Review'
    };
    setMaterialRequests(prev => [newReq, ...prev]);
    addLog('MATERIAL', 'Submitted Request', currentUser.name, currentUser.dept, currentUser.name, 'Pending', `Requested material ${matData.materialName} (Qty: ${matData.quantity}).`);
    return newReq;
  };

  const updateMaterialStatus = (requestId, status, acceptedBy, extra = {}) => {
    setMaterialRequests(prev => prev.map(item => {
      if (item.id === requestId) {
        const updated = {
          ...item,
          status,
          acceptedBy: acceptedBy || currentUser.name,
          ...extra
        };
        if (status === 'Accepted') updated.acceptedDate = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
        if (status === 'Ordered') updated.orderDate = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
        if (status === 'Handed Over') updated.handoverDate = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });

        addLog('MATERIAL', `Material Status: ${status}`, item.empName, item.dept, currentUser.name, status, `Material request ${item.id} status updated to ${status}.`);
        return updated;
      }
      return item;
    }));
  };

  // Work Assignment Actions
  const assignWorkTask = (taskData) => {
    const id = `WORK-2026-${(workAssignments.length + 1).toString().padStart(3, '0')}`;
    const newTask = {
      id,
      assignerName: currentUser.name,
      fromDept: currentUser.dept,
      ...taskData,
      hardwareConfirmed: false,
      docConfirmed: false,
      status: 'Assigned',
      materialRequested: false,
      progress: 0,
      assignedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      completedDate: null,
      completionDays: null
    };
    setWorkAssignments(prev => [newTask, ...prev]);
    addLog('WORK', 'Work Request Created', taskData.assignedEmpName, taskData.toDept, currentUser.name, 'Assigned', `Created task ${taskData.projectName} assigned to ${taskData.assignedEmpName}.`);
    return newTask;
  };

  const updateWorkTaskStatus = (taskId, status, extra = {}) => {
    setWorkAssignments(prev => prev.map(item => {
      if (item.id === taskId) {
        const updated = {
          ...item,
          status,
          ...extra
        };
        if (status === 'Completed') {
          updated.completedDate = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
          updated.progress = 100;
          updated.completionDays = 2;
        }
        addLog('WORK', `Work Status: ${status}`, item.assignedEmpName, item.toDept, currentUser.name, status, `Work task ${item.id} (${item.projectName}) set to ${status}.`);
        return updated;
      }
      return item;
    }));
  };

  const addInventoryItem = (itemData) => {
    const id = `INV-${Date.now().toString().slice(-4)}`;
    const newItem = {
      id,
      ...itemData,
      status: itemData.qty > itemData.minQty ? 'In Stock' : itemData.qty > 0 ? 'Low Stock' : 'Out of Stock'
    };
    setInventory(prev => [newItem, ...prev]);
    addLog('MATERIAL', 'Added Inventory Item', currentUser.name, currentUser.dept, currentUser.name, 'In Stock', `Added item ${itemData.name}.`);
  };

  const exportToExcel = (dataArray, filename = 'Kyvera_Export.csv') => {
    if (!dataArray || !dataArray.length) return;
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(obj => 
      Object.values(obj).map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      loginAsUser,
      registerUser,
      logout,
      currentUser,
      currentRoleKey,
      employees,
      departments,
      leaveRequests,
      materialRequests,
      inventory,
      workAssignments,
      activityLogs,
      activeTab,
      setActiveTab,
      notificationCount,
      setNotificationCount,
      applyLeave,
      updateLeaveStatus,
      submitMaterialRequest,
      updateMaterialStatus,
      assignWorkTask,
      updateWorkTaskStatus,
      addInventoryItem,
      exportToExcel
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
