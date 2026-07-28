class UserRole {
  final String id;
  final String title;
  final String name;
  final String empId;
  final String dept;

  UserRole({
    required this.id,
    required this.title,
    required this.name,
    required this.empId,
    required this.dept,
  });
}

class Employee {
  final String id;
  final String name;
  final String role;
  final String dept;
  final String email;

  Employee({
    required this.id,
    required this.name,
    required this.role,
    required this.dept,
    required this.email,
  });
}

class LeaveRequest {
  final String id;
  final String empId;
  final String empName;
  final String dept;
  final String fromDate;
  final String toDate;
  final int leaveDays;
  final String leaveType;
  final String priority;
  final String purpose;
  final String contactNumber;
  final String appliedDate;
  String? approvedDate;
  String? approvedBy;
  String status;

  LeaveRequest({
    required this.id,
    required this.empId,
    required this.empName,
    required this.dept,
    required this.fromDate,
    required this.toDate,
    required this.leaveDays,
    required this.leaveType,
    required this.priority,
    required this.purpose,
    required this.contactNumber,
    required this.appliedDate,
    this.approvedDate,
    this.approvedBy,
    required this.status,
  });
}

class MaterialRequest {
  final String id;
  final String empId;
  final String empName;
  final String dept;
  final String materialName;
  final String quantity;
  final String projectName;
  final String priority;
  String availability;
  final String requestDate;
  String? acceptedDate;
  String? orderDate;
  String? receivedDate;
  String? handoverDate;
  String? acceptedBy;
  String status;
  String deliveryDuration;

  MaterialRequest({
    required this.id,
    required this.empId,
    required this.empName,
    required this.dept,
    required this.materialName,
    required this.quantity,
    required this.projectName,
    required this.priority,
    this.availability = 'Checking...',
    required this.requestDate,
    this.acceptedDate,
    this.orderDate,
    this.receivedDate,
    this.handoverDate,
    this.acceptedBy,
    required this.status,
    this.deliveryDuration = 'Pending',
  });
}

class InventoryItem {
  final String id;
  final String name;
  final String category;
  int qty;
  final String unit;
  final int minQty;
  String status;
  final String location;

  InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.qty,
    required this.unit,
    required this.minQty,
    required this.status,
    required this.location,
  });
}

class WorkTask {
  final String id;
  final String assignerName;
  final String fromDept;
  final String toDept;
  final String assignedEmpId;
  final String assignedEmpName;
  final String projectName;
  final String hardwareDetails; // MANDATORY
  final String docDetails;      // MANDATORY
  final String priority;
  bool hardwareConfirmed;
  bool docConfirmed;
  String status;
  int progress;
  final String assignedDate;
  String? completedDate;

  WorkTask({
    required this.id,
    required this.assignerName,
    required this.fromDept,
    required this.toDept,
    required this.assignedEmpId,
    required this.assignedEmpName,
    required this.projectName,
    required this.hardwareDetails,
    required this.docDetails,
    required this.priority,
    this.hardwareConfirmed = false,
    this.docConfirmed = false,
    required this.status,
    this.progress = 0,
    required this.assignedDate,
    this.completedDate,
  });
}

class ActivityLog {
  final String id;
  final String type;
  final String action;
  final String empName;
  final String dept;
  final String timestamp;
  final String updatedBy;
  final String status;
  final String details;

  ActivityLog({
    required this.id,
    required this.type,
    required this.action,
    required this.empName,
    required this.dept,
    required this.timestamp,
    required this.updatedBy,
    required this.status,
    required this.details,
  });
}
