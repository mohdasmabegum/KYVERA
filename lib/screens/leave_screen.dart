import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/app_provider.dart';
import '../models/app_models.dart';
import '../utils/theme.dart';

class LeaveScreen extends StatelessWidget {
  const LeaveScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();
    final isHR = app.currentUser.id == 'HR' || app.currentUser.id == 'CEO';

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Leave Management Portal', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: KyveraTheme.cyanPrimary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _showApplyLeaveDialog(context, app),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Apply Leave', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...app.leaveRequests.map((req) => Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: KyveraTheme.cardDark,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: KyveraTheme.borderDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${req.empName} (${req.empId})', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: req.status == 'Approved' ? KyveraTheme.greenPrimary.withOpacity(0.2) : KyveraTheme.importantAmber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        req.status,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: req.status == 'Approved' ? KyveraTheme.greenPrimary : KyveraTheme.importantAmber,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text('Type: ${req.leaveType} (${req.leaveDays} Days) • Dates: ${req.fromDate} to ${req.toDate}', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                Text('Purpose: ${req.purpose}', style: const TextStyle(fontSize: 12, color: Colors.white60)),
                Text('Contact: ${req.contactNumber} • Priority: ${req.priority}', style: const TextStyle(fontSize: 11, color: KyveraTheme.cyanPrimary)),
                
                if (isHR && req.status == 'Pending') ...[
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: KyveraTheme.greenPrimary, foregroundColor: Colors.white),
                        onPressed: () => app.updateLeaveStatus(req.id, 'Approved'),
                        child: const Text('Approve', style: TextStyle(fontSize: 11)),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(foregroundColor: KyveraTheme.emergencyRed),
                        onPressed: () => app.updateLeaveStatus(req.id, 'Rejected'),
                        child: const Text('Reject', style: TextStyle(fontSize: 11)),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          )),
        ],
      ),
    );
  }

  void _showApplyLeaveDialog(BuildContext context, AppProvider app) {
    final purposeCtrl = TextEditingController();
    final contactCtrl = TextEditingController(text: '+91 98765 43210');
    String leaveType = 'EL';
    String priority = 'General';

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: KyveraTheme.cardDark,
          title: const Text('Submit Leave Request', style: TextStyle(color: Colors.white)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: purposeCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: 'Purpose of Leave', labelStyle: TextStyle(color: Colors.white70)),
              ),
              TextField(
                controller: contactCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: 'Emergency Contact No', labelStyle: TextStyle(color: Colors.white70)),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: KyveraTheme.cyanPrimary),
              onPressed: () {
                if (purposeCtrl.text.isNotEmpty) {
                  app.applyLeave(LeaveRequest(
                    id: 'LV-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
                    empId: app.currentUser.empId,
                    empName: app.currentUser.name,
                    dept: app.currentUser.dept,
                    fromDate: DateFormat('yyyy-MM-dd').format(DateTime.now()),
                    toDate: DateFormat('yyyy-MM-dd').format(DateTime.now().add(const Duration(days: 2))),
                    leaveDays: 3,
                    leaveType: leaveType,
                    priority: priority,
                    purpose: purposeCtrl.text,
                    contactNumber: contactCtrl.text,
                    appliedDate: DateFormat('MM/dd/yy hh:mm a').format(DateTime.now()),
                    status: 'Pending',
                  ));
                  Navigator.pop(context);
                }
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }
}
