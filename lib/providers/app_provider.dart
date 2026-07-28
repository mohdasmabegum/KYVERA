import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/app_models.dart';

class AppProvider extends ChangeNotifier {
  static final Map<String, UserRole> roles = {
    'CEO': UserRole(id: 'CEO', title: 'CEO / Founder', name: 'Dr. Rajesh Varma', empId: 'MRA-001', dept: 'Executive'),
    'HR': UserRole(id: 'HR', title: 'HR Manager', name: 'Ananya Sharma', empId: 'MRA-002', dept: 'Human Resources'),
    'COORDINATOR': UserRole(id: 'COORDINATOR', title: 'Project Coordinator', name: 'Vikram Seth', empId: 'MRA-003', dept: 'Operations'),
    'TEAM_LEAD': UserRole(id: 'TEAM_LEAD', title: 'Team Lead', name: 'Arjun Mehta', empId: 'MRA-004', dept: 'Engineering'),
    'EMPLOYEE': UserRole(id: 'EMPLOYEE', title: 'Employee', name: 'Suresh Kumar', empId: 'MRA-005', dept: 'Engineering'),
    'INVENTORY': UserRole(id: 'INVENTORY', title: 'Inventory Manager', name: 'Priya Nair', empId: 'MRA-006', dept: 'Supply Chain'),
  };

  String _currentRoleKey = 'CEO';
  UserRole _currentUser = roles['CEO']!;
  int _activeTab = 0;

  UserRole get currentUser => _currentUser;
  String get currentRoleKey => _currentRoleKey;
  int get activeTab => _activeTab;

  final List<String> departments = [
    'Engineering',
    'Human Resources',
    'Supply Chain',
    'Operations',
    'Quality Assurance',
    'Hardware & Robotics',
    'Executive'
  ];

  final List<Employee> employees = [
    Employee(id: 'MRA-001', name: 'Dr. Rajesh Varma', role: 'CEO', dept: 'Executive', email: 'rajesh@mra.com'),
    Employee(id: 'MRA-002', name: 'Ananya Sharma', role: 'HR', dept: 'Human Resources', email: 'ananya@mra.com'),
    Employee(id: 'MRA-003', name: 'Vikram Seth', role: 'COORDINATOR', dept: 'Operations', email: 'vikram@mra.com'),
    Employee(id: 'MRA-004', name: 'Arjun Mehta', role: 'TEAM_LEAD', dept: 'Engineering', email: 'arjun@mra.com'),
    Employee(id: 'MRA-005', name: 'Suresh Kumar', role: 'EMPLOYEE', dept: 'Engineering', email: 'suresh@mra.com'),
    Employee(id: 'MRA-006', name: 'Priya Nair', role: 'INVENTORY', dept: 'Supply Chain', email: 'priya@mra.com'),
  ];

  final List<LeaveRequest> leaveRequests = [
    LeaveRequest(
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
      appliedDate: '07/27/26 10:30 AM',
      approvedDate: '07/27/26 02:15 PM',
      approvedBy: 'Ananya Sharma (HR)',
      status: 'Approved',
    ),
    LeaveRequest(
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
      appliedDate: '07/28/26 09:15 AM',
      status: 'Pending',
    ),
  ];

  final List<MaterialRequest> materialRequests = [
    MaterialRequest(
      id: 'MAT-2026-001',
      empId: 'MRA-005',
      empName: 'Suresh Kumar',
      dept: 'Engineering',
      materialName: 'Microcontroller Dev Boards (STM32)',
      quantity: '5 pcs',
      projectName: 'KYVERA Automation Module',
      priority: 'Quick',
      availability: 'Available',
      requestDate: '07/28/26 08:30 AM',
      acceptedDate: '07/28/26 09:45 AM',
      handoverDate: '07/28/26 11:00 AM',
      acceptedBy: 'Priya Nair',
      status: 'Handed Over',
      deliveryDuration: '2 hrs 30 mins',
    ),
    MaterialRequest(
      id: 'MAT-2026-002',
      empId: 'MRA-004',
      empName: 'Arjun Mehta',
      dept: 'Hardware & Robotics',
      materialName: 'DIN-Rail Power Supply 24V 10A',
      quantity: '2 pcs',
      projectName: 'Robotics Rig Rev-2',
      priority: 'Emergency',
      availability: 'Out of Stock',
      requestDate: '07/28/26 10:00 AM',
      acceptedDate: '07/28/26 10:30 AM',
      orderDate: '07/28/26 11:15 AM',
      acceptedBy: 'Priya Nair',
      status: 'Ordered',
      deliveryDuration: 'Estimated 2 Days',
    ),
  ];

  final List<InventoryItem> inventory = [
    InventoryItem(id: 'INV-101', name: 'Microcontroller Dev Boards (STM32)', category: 'Hardware', qty: 45, unit: 'pcs', minQty: 10, status: 'In Stock', location: 'Rack A-3'),
    InventoryItem(id: 'INV-102', name: 'Industrial Fiber Cables', category: 'Cables', qty: 120, unit: 'meters', minQty: 50, status: 'In Stock', location: 'Rack B-1'),
    InventoryItem(id: 'INV-103', name: 'High-Precision Stepper Motors', category: 'Actuators', qty: 8, unit: 'pcs', minQty: 15, status: 'Low Stock', location: 'Rack C-2'),
    InventoryItem(id: 'INV-104', name: 'DIN-Rail Power Supply 24V 10A', category: 'Power', qty: 0, unit: 'pcs', minQty: 5, status: 'Out of Stock', location: 'Rack D-4'),
  ];

  final List<WorkTask> workAssignments = [
    WorkTask(
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
      progress: 45,
      assignedDate: '07/27/26 11:00 AM',
    ),
    WorkTask(
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
      progress: 0,
      assignedDate: '07/28/26 12:30 PM',
    ),
  ];

  final List<ActivityLog> activityLogs = [
    ActivityLog(id: 'LOG-001', type: 'WORK', action: 'Task Assigned', empName: 'Suresh Kumar', dept: 'Engineering', timestamp: '07/28/26 12:30 PM', updatedBy: 'Arjun Mehta', status: 'Assigned', details: 'Assigned work: PLC Signal Calibration with Hardware & Documentation checks.'),
    ActivityLog(id: 'LOG-002', type: 'MATERIAL', action: 'Material Ordered', empName: 'Arjun Mehta', dept: 'Hardware & Robotics', timestamp: '07/28/26 11:15 AM', updatedBy: 'Priya Nair', status: 'Ordered', details: 'Ordered 2 pcs of DIN-Rail Power Supply 24V 10A from vendor.'),
    ActivityLog(id: 'LOG-003', type: 'LEAVE', action: 'Leave Applied', empName: 'Arjun Mehta', dept: 'Engineering', timestamp: '07/28/26 09:15 AM', updatedBy: 'Arjun Mehta', status: 'Pending', details: 'Applied 2 days CL for medical emergency.'),
  ];

  void switchRole(String key) {
    if (roles.containsKey(key)) {
      _currentRoleKey = key;
      _currentUser = roles[key]!;
      notifyListeners();
    }
  }

  void setActiveTab(int index) {
    _activeTab = index;
    notifyListeners();
  }

  void addLog(String type, String action, String empName, String dept, String updatedBy, String status, String details) {
    activityLogs.insert(0, ActivityLog(
      id: 'LOG-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
      type: type,
      action: action,
      empName: empName,
      dept: dept,
      timestamp: DateFormat('MM/dd/yy hh:mm a').format(DateTime.now()),
      updatedBy: updatedBy,
      status: status,
      details: details,
    ));
    notifyListeners();
  }

  void applyLeave(LeaveRequest req) {
    leaveRequests.insert(0, req);
    addLog('LEAVE', 'Applied Leave', currentUser.name, currentUser.dept, currentUser.name, 'Pending', 'Applied for ${req.leaveDays} days ${req.leaveType} leave.');
    notifyListeners();
  }

  void updateLeaveStatus(String id, String status) {
    for (var l in leaveRequests) {
      if (l.id == id) {
        l.status = status;
        l.approvedBy = currentUser.name;
        l.approvedDate = DateFormat('MM/dd/yy hh:mm a').format(DateTime.now());
        addLog('LEAVE', 'Leave $status', l.empName, l.dept, currentUser.name, status, 'Leave request $id set to $status.');
        break;
      }
    }
    notifyListeners();
  }

  void submitMaterialRequest(MaterialRequest req) {
    materialRequests.insert(0, req);
    addLog('MATERIAL', 'Submitted Request', currentUser.name, currentUser.dept, currentUser.name, 'Pending', 'Requested ${req.materialName} (Qty: ${req.quantity}).');
    notifyListeners();
  }

  void updateMaterialStatus(String id, String status, {String? availability}) {
    for (var m in materialRequests) {
      if (m.id == id) {
        m.status = status;
        m.acceptedBy = currentUser.name;
        if (availability != null) m.availability = availability;
        final nowStr = DateFormat('MM/dd/yy hh:mm a').format(DateTime.now());
        if (status == 'Accepted') m.acceptedDate = nowStr;
        if (status == 'Ordered') m.orderDate = nowStr;
        if (status == 'Received') m.receivedDate = nowStr;
        if (status == 'Handed Over') m.handoverDate = nowStr;
        addLog('MATERIAL', 'Material $status', m.empName, m.dept, currentUser.name, status, 'Material request $id status set to $status.');
        break;
      }
    }
    notifyListeners();
  }

  void assignWorkTask(WorkTask task) {
    workAssignments.insert(0, task);
    addLog('WORK', 'Work Assigned', task.assignedEmpName, task.toDept, currentUser.name, 'Assigned', 'Assigned project task ${task.projectName} to ${task.assignedEmpName}.');
    notifyListeners();
  }

  void updateWorkTaskStatus(String id, String status, {int? progress, bool? hw, bool? doc}) {
    for (var w in workAssignments) {
      if (w.id == id) {
        w.status = status;
        if (progress != null) w.progress = progress;
        if (hw != null) w.hardwareConfirmed = hw;
        if (doc != null) w.docConfirmed = doc;
        if (status == 'Completed') {
          w.progress = 100;
          w.completedDate = DateFormat('MM/dd/yy hh:mm a').format(DateTime.now());
        }
        addLog('WORK', 'Work Status: $status', w.assignedEmpName, w.toDept, currentUser.name, status, 'Work task $id set to $status.');
        break;
      }
    }
    notifyListeners();
  }
}
