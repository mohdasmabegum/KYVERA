import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/app_provider.dart';
import '../../utils/theme.dart';

class DashboardView extends StatelessWidget {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();
    final user = app.currentUser;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF0E1C2E), Color(0xFF0A2540)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: KyveraTheme.cyanPrimary.withOpacity(0.3)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.auto_awesome, color: KyveraTheme.cyanPrimary, size: 18),
                    SizedBox(width: 8),
                    Text(
                      'EXECUTIVE COMMAND CENTER',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: KyveraTheme.cyanPrimary, letterSpacing: 1.0),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Welcome, ${user.name}',
                  style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                Text(
                  'Role: ${user.title} • Department: ${user.dept}',
                  style: const TextStyle(fontSize: 12, color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Stat Cards Grid
          LayoutBuilder(
            builder: (context, constraints) {
              final crossCount = constraints.maxWidth > 600 ? 4 : 2;
              return GridView.count(
                crossAxisCount: crossCount,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.5,
                children: [
                  _buildStatCard('Total Workforce', '${app.employees.length}', 'Employees', Icons.people_outline, KyveraTheme.cyanPrimary),
                  _buildStatCard('Pending Leaves', '${app.leaveRequests.where((l) => l.status == "Pending").length}', 'Needs HR Review', Icons.calendar_month, KyveraTheme.importantAmber),
                  _buildStatCard('Active Tasks', '${app.workAssignments.where((w) => w.status != "Completed").length}', 'HW + SOP Check', Icons.swap_horiz, KyveraTheme.greenPrimary),
                  _buildStatCard('Stock Alert', '${app.inventory.where((i) => i.qty <= i.minQty).length}', 'Low/Out Stock', Icons.inventory_2_outlined, KyveraTheme.emergencyRed),
                ],
              );
            },
          ),
          const SizedBox(height: 20),

          // Active Work Pipeline List
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: KyveraTheme.cardDark,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: KyveraTheme.borderDark),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Active Department Task Pipeline', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white)),
                    Icon(Icons.arrow_forward, size: 16, color: KyveraTheme.cyanPrimary),
                  ],
                ),
                const SizedBox(height: 12),
                ...app.workAssignments.take(3).map((task) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFF070E17),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(task.projectName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0A2540),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text('${task.status} (${task.progress}%)', style: const TextStyle(fontSize: 10, color: KyveraTheme.cyanPrimary, fontWeight: FontWeight.bold)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text('From ${task.fromDept} → To ${task.toDept} (${task.assignedEmpName})', style: const TextStyle(fontSize: 11, color: Colors.white70)),
                    ],
                  ),
                )),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String title, String val, String subtitle, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: KyveraTheme.cardDark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: const TextStyle(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w600)),
              Icon(icon, size: 18, color: color),
            ],
          ),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: color)),
          Text(subtitle, style: const TextStyle(fontSize: 9, color: Colors.white54)),
        ],
      ),
    );
  }
}
