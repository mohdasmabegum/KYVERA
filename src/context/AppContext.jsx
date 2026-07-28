import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const ROLES = {
  TEAM_LEAD: { id: 'TEAM_LEAD', title: 'Team Lead / Sub-TL' },
  INVENTORY: { id: 'INVENTORY', title: 'Inventory Manager' },
  EMPLOYEE: { id: 'EMPLOYEE', title: 'Normal Employee' },
  COORDINATOR: { id: 'COORDINATOR', title: 'Project Coordinator' },
  CEO: { id: 'CEO', title: 'CEO / Founder / Director' },
  HR: { id: 'HR', title: 'HR Manager' },
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
  // Load saved user account from localStorage (default null if not logged in)
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

  // User Sign In
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
      TEAM_LEAD: 'Team Lead / Sub-TL',
      INVENTORY: 'Inventory Manager',
      EMPLOYEE: 'Normal Employee',
      COORDINATOR: 'Project Coordinator',
      CEO: 'CEO / Founder / Director',
      HR: 'HR Manager'
    };

    const newAccount = {
      id: accountData.role,
      title: titleMap[accountData.role] || 'Enterprise Account',
      name: accountData.name,
      empId: accountData.empId || `MRA-${Math.floor(100 + Math.random() * 900)}`,
      dept: accountData.dept || 'Engineering',
      email: accountData.email,
      orgName: accountData.orgName || 'MRA Enterprise',
      createdDate: new Date().toLocaleDateString()
    };

    setRegisteredAccounts(prev => [newAccount, ...prev]);
    setCurrentUser(newAccount);
    setIsAuthenticated(true);
    setActiveTab(getDefaultTabForRole(newAccount.id));

    localStorage.setItem('kyvera_auth_user', JSON.stringify(newAccount));
    addLog('SYSTEM', 'Account Registered', newAccount.name, newAccount.dept, newAccount.name, 'Active', `New ${newAccount.title} account registered.`);
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
      empId: currentUser?.empId || 'MRA-001',
      empName: currentUser?.name || 'User',
      dept: currentUser?.dept || 'Operations',
      ...leaveData,
      appliedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      approvedDate: null,
      approvedBy: null,
      status: 'Pending'
    };
    setLeaveRequests(prev => [newLeave, ...prev]);
    addLog('LEAVE', 'Applied Leave', currentUser?.name, currentUser?.dept, currentUser?.name, 'Pending', `Applied for ${leaveData.leaveDays} days ${leaveData.leaveType} leave.`);
    return newLeave;
  };

  const updateLeaveStatus = (leaveId, status, approvedBy) => {
    setLeaveRequests(prev => prev.map(item => {
      if (item.id === leaveId) {
        const updated = {
          ...item,
          status,
          approvedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
          approvedBy: approvedBy || currentUser?.name
        };
        addLog('LEAVE', `Leave ${status}`, item.empName, item.dept, currentUser?.name, status, `Leave request ${item.id} marked as ${status}.`);
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
      empId: currentUser?.empId || 'MRA-001',
      empName: currentUser?.name || 'User',
      dept: currentUser?.dept || 'Operations',
      ...matData,
      availability: 'Checking...',
      requestDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Pending'
    };
    setMaterialRequests(prev => [newReq, ...prev]);
    addLog('MATERIAL', 'Submitted Request', currentUser?.name, currentUser?.dept, currentUser?.name, 'Pending', `Requested material ${matData.materialName} (Qty: ${matData.quantity}).`);
    return newReq;
  };

  const updateMaterialStatus = (requestId, status, acceptedBy, extra = {}) => {
    setMaterialRequests(prev => prev.map(item => {
      if (item.id === requestId) {
        const updated = {
          ...item,
          status,
          acceptedBy: acceptedBy || currentUser?.name,
          ...extra
        };
        addLog('MATERIAL', `Material Status: ${status}`, item.empName, item.dept, currentUser?.name, status, `Material request ${item.id} status updated to ${status}.`);
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
      assignerName: currentUser?.name || 'User',
      fromDept: currentUser?.dept || 'Operations',
      ...taskData,
      hardwareConfirmed: false,
      docConfirmed: false,
      status: 'Assigned',
      progress: 0,
      assignedDate: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
      completedDate: null
    };
    setWorkAssignments(prev => [newTask, ...prev]);
    addLog('WORK', 'Work Request Created', taskData.assignedEmpName, taskData.toDept, currentUser?.name, 'Assigned', `Created task ${taskData.projectName} assigned to ${taskData.assignedEmpName}.`);
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
        }
        addLog('WORK', `Work Status: ${status}`, item.assignedEmpName, item.toDept, currentUser?.name, status, `Work task ${item.id} (${item.projectName}) set to ${status}.`);
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
    addLog('MATERIAL', 'Added Inventory Item', currentUser?.name, currentUser?.dept, currentUser?.name, 'In Stock', `Added item ${itemData.name}.`);
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
