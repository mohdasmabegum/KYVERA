import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../utils/theme.dart';

class ActivityLogsScreen extends StatelessWidget {
  const ActivityLogsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Enterprise Activity Audit Trail', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
          const SizedBox(height: 16),

          ...app.activityLogs.map((log) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: KyveraTheme.cardDark,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: KyveraTheme.borderDark),
            ),
            child: Row(
              children: [
                Icon(
                  log.type == 'LEAVE' ? Icons.calendar_today : log.type == 'MATERIAL' ? Icons.inventory : Icons.swap_horiz,
                  color: KyveraTheme.cyanPrimary,
                  size: 20,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(log.action, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.white)),
                          Text(log.timestamp, style: const TextStyle(fontSize: 10, color: Colors.white54)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(log.details, style: const TextStyle(fontSize: 11, color: Colors.white70)),
                      Text('By: ${log.updatedBy} • Employee: ${log.empName} (${log.dept})', style: const TextStyle(fontSize: 10, color: Colors.white54)),
                    ],
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    );
  }
}
