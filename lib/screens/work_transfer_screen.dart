import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/app_models.dart';
import '../utils/theme.dart';

class WorkTransferScreen extends StatelessWidget {
  const WorkTransferScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Work Transfer & Task Tracking', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: KyveraTheme.cyanPrimary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _showAssignWorkDialog(context, app),
                icon: const Icon(Icons.swap_horiz, size: 16),
                label: const Text('Transfer Task', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...app.workAssignments.map((task) => Container(
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
                    Text(task.projectName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: KyveraTheme.cyanPrimary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text('${task.status} (${task.progress}%)', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: KyveraTheme.cyanPrimary)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text('From ${task.fromDept} (${task.assignerName}) → To ${task.toDept} (${task.assignedEmpName})', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                const SizedBox(height: 8),

                // Hardware & Documentation Handshake Verification Cards
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF070E17),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: task.hardwareConfirmed ? KyveraTheme.greenPrimary : Colors.white10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Mandatory Hardware:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: KyveraTheme.cyanPrimary)),
                            Text(task.hardwareDetails, style: const TextStyle(fontSize: 10, color: Colors.white70)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFF070E17),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: task.docConfirmed ? KyveraTheme.greenPrimary : Colors.white10),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Mandatory Documentation:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: KyveraTheme.greenPrimary)),
                            Text(task.docDetails, style: const TextStyle(fontSize: 10, color: Colors.white70)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),

                if (task.status == 'Assigned') ...[
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: KyveraTheme.greenPrimary, foregroundColor: Colors.white),
                    onPressed: () => app.updateWorkTaskStatus(task.id, 'Accepted', hw: true, doc: true, progress: 20),
                    icon: const Icon(Icons.check_circle_outline, size: 14),
                    label: const Text('Confirm HW + Doc Receipt & Accept', style: TextStyle(fontSize: 11)),
                  ),
                ],
              ],
            ),
          )),
        ],
      ),
    );
  }

  void _showAssignWorkDialog(BuildContext context, AppProvider app) {
    final projCtrl = TextEditingController();
    final hwCtrl = TextEditingController();
    final docCtrl = TextEditingController();
    String toDept = app.departments[0];
    String assignedEmpId = app.employees[4].id;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: KyveraTheme.cardDark,
          title: const Text('Transfer Work Task', style: TextStyle(color: Colors.white)),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: projCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Project Name', labelStyle: TextStyle(color: Colors.white70)),
                ),
                TextField(
                  controller: hwCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Mandatory Hardware Details *', labelStyle: TextStyle(color: KyveraTheme.cyanPrimary)),
                ),
                TextField(
                  controller: docCtrl,
                  style: const TextStyle(color: Colors.white),
                  decoration: const InputDecoration(labelText: 'Mandatory Documentation SOP *', labelStyle: TextStyle(color: KyveraTheme.greenPrimary)),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: KyveraTheme.cyanPrimary),
              onPressed: () {
                if (projCtrl.text.isNotEmpty && hwCtrl.text.isNotEmpty && docCtrl.text.isNotEmpty) {
                  final emp = app.employees.firstWhere((e) => e.id == assignedEmpId);
                  app.assignWorkTask(WorkTask(
                    id: 'WORK-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
                    assignerName: app.currentUser.name,
                    fromDept: app.currentUser.dept,
                    toDept: toDept,
                    assignedEmpId: emp.id,
                    assignedEmpName: emp.name,
                    projectName: projCtrl.text,
                    hardwareDetails: hwCtrl.text,
                    docDetails: docCtrl.text,
                    priority: 'Emergency',
                    status: 'Assigned',
                    assignedDate: DateTime.now().toString().substring(0, 16),
                  ));
                  Navigator.pop(context);
                }
              },
              child: const Text('Transfer'),
            ),
          ],
        );
      },
    );
  }
}
