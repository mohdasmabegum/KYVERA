import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  CEO: { id: 'CEO', title: 'CEO / Founder / Director', accessLevel: 'EXECUTIVE' },
  COORDINATOR: { id: 'COORDINATOR', title: 'Project Coordinator', accessLevel: 'EXECUTIVE' },
  TEAM_LEAD: { id: 'TEAM_LEAD', title: 'Team Lead (TL)', accessLevel: 'EXECUTIVE' },
  HR: { id: 'HR', title: 'HR Manager', accessLevel: 'EXECUTIVE' },
  INVENTORY: { id: 'INVENTORY', title: 'Inventory Manager', accessLevel: 'INVENTORY' },
  EMPLOYEE: { id: 'EMPLOYEE', title: 'Employee Persona Account', accessLevel: 'EMPLOYEE' }
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

const INITIAL_INVENTORY = [
  { id: 'INV-101', name: 'Microcontroller Dev Boards (STM32)', category: 'Hardware', qty: 45, unit: 'pcs', minQty: 10, status: 'In Stock', location: 'Rack A-3' },
  { id: 'INV-102', name: 'Industrial Fiber Cables', category: 'Cables', qty: 120, unit: 'meters', minQty: 50, status: 'In Stock', location: 'Rack B-1' },
  { id: 'INV-103', name: 'High-Precision Stepper Motors', category: 'Actuators', qty: 8, unit: 'pcs', minQty: 15, status: 'Low Stock', location: 'Rack C-2' },
  { id: 'INV-104', name: 'DIN-Rail Power Supply 24V 10A', category: 'Power', qty: 0, unit: 'pcs', minQty: 5, status: 'Out of Stock', location: 'Rack D-4' }
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
  const [currentUser, setCurrentUser] = useState(() => savedUser || null);

  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_registered_accounts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [leaveRequests, setLeaveRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_leaves');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [materialRequests, setMaterialRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_material');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_inventory');
      return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [workAssignments, setWorkAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_work');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('kyvera_logs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [departments] = useState(INITIAL_DEPARTMENTS);

  const getDefaultTabForRole = (roleKey) => {
    if (roleKey === 'HR') return 'leave';
    if (roleKey === 'INVENTORY') return 'material';
    if (roleKey === 'EMPLOYEE') return 'work';
    return 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(() => getDefaultTabForRole(currentUser?.id || 'CEO'));
  const [notificationCount, setNotificationCount] = useState(1);
  const [completionNotification, setCompletionNotification] = useState(null);

  // User Login
  const loginAsUser = (email, password) => {
    const account = registeredAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (account) {
      setCurrentUser(account);
      setIsAuthenticated(true);
      setActiveTab(getDefaultTabForRole(account.id));
      localStorage.setItem('kyvera_auth_user', JSON.stringify(account));
      return { success: true, user: account };
    }
    return { success: false, message: 'Account not found. Please register a new account.' };
  };

  // Register User Account
  const registerUser = (accountData) => {
    const titleMap = {
      CEO: 'CEO / Founder / Director',
      COORDINATOR: 'Project Coordinator',
      TEAM_LEAD: 'Team Lead (TL)',
      HR: 'HR Manager',
      INVENTORY: 'Inventory Manager',
      EMPLOYEE: 'Employee Persona Account'
    };

    const newAccount = {
      id: accountData.role,
      title: titleMap[accountData.role] || 'Enterprise Account',
      name: accountData.name,
      empId: accountData.empId || `MRA-${Math.floor(100 + Math.random() * 900)}`,
      dept: accountData.dept || 'Engineering',
      email: accountData.email,
      createdDate: new Date().toLocaleDateString()
    };

    setRegisteredAccounts(prev => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    setActiveTab(getDefaultTabForRole(newAccount.id));

    localStorage.setItem('kyvera_auth_user', JSON.stringify(newAccount));
    addLog('SYSTEM', 'Account Registered', newAccount.name, newAccount.dept, newAccount.name, 'Active', `New ${newAccount.title} account registered for ${newAccount.name}.`);
    return newAccount;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('kyvera_auth_user');
  };

  // Sync to LocalStorage
  useEffect(() => { localStorage.setItem('kyvera_registered_accounts', JSON.stringify(registeredAccounts)); }, [registeredAccounts]);
  useEffect(() => { localStorage.setItem('kyvera_leaves', JSON.stringify(leaveRequests)); }, [leaveRequests]);
  useEffect(() => { localStorage.setItem('kyvera_material', JSON.stringify(materialRequests)); }, [materialRequests]);
  useEffect(() => { localStorage.setItem('kyvera_inventory', JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem('kyvera_work', JSON.stringify(workAssignments)); }, [workAssignments]);
  useEffect(() => { localStorage.setItem('kyvera_logs', JSON.stringify(activityLogs)); }, [activityLogs]);

  // Log helper
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

  // LEAVE APPLICATION DATABASE ACTIONS
  const applyLeave = (leaveData) => {
    const id = `LV-2026-${(leaveRequests.length + 1).toString().padStart(3, '0')}`;
    const newLeave = {
      id,
      empId: currentUser?.empId || 'MRA-001',
      name: currentUser?.name || 'Employee',
      dept: leaveData.dept || currentUser?.dept || 'Operations',
      fromDate: leaveData.fromDate,
      toDate: leaveData.toDate,
      date: `${leaveData.fromDate} to ${leaveData.toDate}`,
      contact: leaveData.contactNumber || '+91 98765 00000',
      leaveDays: leaveData.leaveDays || 1,
      leaveType: leaveData.leaveType, // EL / CL
      priority: leaveData.priority, // Emergency / Important / General
      purpose: leaveData.purpose,
      approvedBy: null,
      appliedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      acceptedDate: null,
      status: 'Pending'
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    addLog('LEAVE', 'Applied Leave', newLeave.name, newLeave.dept, newLeave.name, 'Pending', `Applied for ${newLeave.leaveDays} day(s) ${newLeave.leaveType} leave (${newLeave.priority}).`);
    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, approvedBy) => {
    setLeaveRequests(prev => prev.map(item => {
      if (item.id === leaveId) {
        const updated = {
          ...item,
          status,
          approvedBy: approvedBy || currentUser?.name,
          acceptedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })
        };
        addLog('LEAVE', `Leave ${status}`, item.name, item.dept, currentUser?.name, status, `Leave request ${item.id} was marked as ${status} by ${updated.approvedBy}.`);
        return updated;
      }
      return item;
    }));
  };

  // MATERIAL REQUEST DATABASE ACTIONS
  const submitMaterialRequest = (matData) => {
    const id = `MAT-2026-${(materialRequests.length + 1).toString().padStart(3, '0')}`;
    const newReq = {
      id,
      empName: currentUser?.name || 'Employee',
      empId: currentUser?.empId || 'MRA-001',
      dept: matData.dept || currentUser?.dept || 'Operations',
      materialType: matData.materialType,
      unitsOrLength: matData.unitsOrLength,
      priority: matData.priority, // Emergency / Quick
      projectName: matData.projectName,
      availableAtMoment: 'Checking...',
      acceptedOrRejectedByInventoryUser: null,
      providedFromAvailableOrDelayed: null,
      acceptedNotAvailableOrderPlacedDate: null,
      requestDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      reachedDate: null,
      acceptedDate: null,
      providedDate: null,
      orderPlacedDate: null,
      orderReceivedDate: null,
      daysToReceiveOrder: null,
      daysForProvidingMaterial: null,
      status: 'Pending'
    };
    setMaterialRequests(prev => [newReq, ...prev]);
    addLog('MATERIAL', 'Submitted Request', newReq.empName, newReq.dept, newReq.empName, 'Pending', `Requested ${newReq.materialType} (Qty: ${newReq.unitsOrLength}) for project ${newReq.projectName}.`);
    return newReq;
  };

  const updateMaterialStatus = (requestId, status, acceptedBy, extra = {}) => {
    setMaterialRequests(prev => prev.map(item => {
      if (item.id === requestId) {
        const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
        const updated = {
          ...item,
          status,
          acceptedOrRejectedByInventoryUser: acceptedBy || currentUser?.name,
          acceptedDate: item.acceptedDate || nowStr,
          ...extra
        };

        if (status === 'Pending for Order') {
          updated.availableAtMoment = 'Not Available';
          updated.providedFromAvailableOrDelayed = 'Delayed (Order Required)';
        }

        if (status === 'Order Placed') {
          updated.orderPlacedDate = nowStr;
          updated.acceptedNotAvailableOrderPlacedDate = nowStr;
        }

        if (status === 'Handed Over') {
          updated.providedDate = nowStr;
          updated.availableAtMoment = 'Available';
          updated.providedFromAvailableOrDelayed = 'Provided from Stock';
        }

        addLog('MATERIAL', `Material Status: ${status}`, item.empName, item.dept, currentUser?.name, status, `Material request ${item.id} status updated to ${status}.`);
        return updated;
      }
      return item;
    }));
  };

  // WORK LOGS DATABASE ACTIONS
  const assignWorkTask = (taskData) => {
    const id = `WORK-2026-${(workAssignments.length + 1).toString().padStart(3, '0')}`;
    const newTask = {
      id,
      alloterName: currentUser?.name || 'Alloter',
      fromDept: currentUser?.dept || 'Operations',
      toDept: taskData.toDept,
      assignedEmpId: taskData.assignedEmpId,
      assignedEmpName: taskData.assignedEmpName,
      projectName: taskData.projectName,
      hardwareDetails: taskData.hardwareDetails,
      docDetails: taskData.docDetails,
      priority: taskData.priority, // Emergency / Quick / General
      hardwareConfirmed: false,
      docConfirmed: false,
      status: 'Assigned',
      assignedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      acceptedDate: null,
      completedDate: null,
      completionDuration: null
    };
    setWorkAssignments(prev => [newTask, ...prev]);
    addLog('WORK', 'Work Allotted', taskData.assignedEmpName, taskData.toDept, currentUser?.name, 'Assigned', `Created work task ${taskData.projectName} assigned to ${taskData.assignedEmpName}.`);
    return newTask;
  };

  const updateWorkTaskStatus = (taskId, status, extra = {}) => {
    setWorkAssignments(prev => prev.map(item => {
      if (item.id === taskId) {
        const nowStr = new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
        const updated = {
          ...item,
          status,
          ...extra
        };

        if (status === 'Accepted') {
          updated.acceptedDate = nowStr;
          updated.hardwareConfirmed = true;
          updated.docConfirmed = true;
        }

        if (status === 'Completed') {
          updated.completedDate = nowStr;
          updated.completionDuration = 'Done ✅';

          // Pop notification to sender account
          setCompletionNotification({
            taskName: item.projectName,
            completedBy: item.assignedEmpName,
            toDept: item.toDept
          });
        }

        addLog('WORK', `Work Task: ${status}`, item.assignedEmpName, item.toDept, currentUser?.name, status, `Work task ${item.id} (${item.projectName}) was set to ${status}.`);
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
    addLog('MATERIAL', 'Added Inventory Item', currentUser?.name, currentUser?.dept, currentUser?.name, 'In Stock', `Added inventory item ${itemData.name}.`);
  };

  const exportToExcel = (dataArray, filename = 'Kyvera_Database_Sheet.csv') => {
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
      registeredAccounts,
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
      completionNotification,
      setCompletionNotification,
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
