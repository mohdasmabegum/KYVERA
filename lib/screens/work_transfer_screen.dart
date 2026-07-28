import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/app_models.dart';
import '../utils/theme.dart';

class WorkTransferScreen extends StatelessWidget {
  const WorkTransferScreen({super.key});

  int _getStageStep(String status, bool materialRequested) {
    if (status == 'Completed') return 4;
    if (status == 'Material Requested' || materialRequested) return 3;
    if (status == 'In Progress') return 2;
    if (status == 'Accepted') return 1;
    return 0; // Request
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();

    final stages = [
      '1. Request',
      '2. Accept',
      '3. In Progress',
      '4. Issue',
      '5. Completed',
    ];

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
                label: const Text('Place Work Request', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          ...app.workAssignments.map((task) {
            final currentStep = _getStageStep(task.status, task.hardwareConfirmed && task.progress > 0);

            return Container(
              margin: const EdgeInsets.only(bottom: 16),
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
                  const SizedBox(height: 4),
                  Text('From ${task.fromDept} (${task.assignerName}) → To ${task.toDept} (${task.assignedEmpName})', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                  const SizedBox(height: 10),

                  // Sequential Level-by-Level Step Tracker Widget
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF070E17),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Level-by-Level Stage Tracker:', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: KyveraTheme.cyanPrimary)),
                        const SizedBox(height: 6),
                        Row(
                          children: List.generate(stages.length, (idx) {
                            final isDone = idx <= currentStep;
                            final isCurrent = idx == currentStep && task.status != 'Completed';
                            return Expanded(
                              child: Container(
                                margin: const EdgeInsets.symmetric(horizontal: 2),
                                padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
                                decoration: BoxDecoration(
                                  color: isCurrent
                                      ? KyveraTheme.cyanPrimary.withOpacity(0.3)
                                      : isDone
                                          ? KyveraTheme.greenPrimary.withOpacity(0.2)
                                          : Colors.white.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(6),
                                  border: Border.all(
                                    color: isCurrent
                                        ? KyveraTheme.cyanPrimary
                                        : isDone
                                            ? KyveraTheme.greenPrimary
                                            : Colors.white10,
                                  ),
                                ),
                                child: Text(
                                  stages[idx],
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 8,
                                    fontWeight: isCurrent || isDone ? FontWeight.bold : FontWeight.normal,
                                    color: isCurrent
                                        ? KyveraTheme.cyanPrimary
                                        : isDone
                                            ? KyveraTheme.greenPrimary
                                            : Colors.white38,
                                  ),
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),

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
                      label: const Text('Accept (Confirm HW + SOP)', style: TextStyle(fontSize: 11)),
                    ),
                  ],
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  void _showAssignWorkDialog(BuildContext context, AppProvider app) {
    final projCtrl = TextEditingController();
    final hwCtrl = TextEditingController();
    final docCtrl = TextEditingController();
    String toDept = app.departments[0];

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: KyveraTheme.cardDark,
          title: const Text('Place Work Transfer Request', style: TextStyle(color: Colors.white)),
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
                  final emp = app.employees[4];
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
              child: const Text('Transfer Task'),
            ),
          ],
        );
      },
    );
  }
}
