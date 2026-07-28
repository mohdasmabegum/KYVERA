import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../widgets/orbit_logo.dart';
import '../utils/theme.dart';

// Screen Tabs
import 'dashboards/dashboard_view.dart';
import 'leave_screen.dart';
import 'material_screen.dart';
import 'work_transfer_screen.dart';
import 'activity_logs_screen.dart';
import 'self_host_screen.dart';

class MainScreen extends StatelessWidget {
  const MainScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();
    final isDesktop = MediaQuery.of(context).size.width >= 800;

    final pages = [
      const DashboardView(),
      const LeaveScreen(),
      const MaterialScreen(),
      const WorkTransferScreen(),
      const ActivityLogsScreen(),
      const SelfHostScreen(),
    ];

    return Scaffold(
      backgroundColor: KyveraTheme.bgDark,
      appBar: AppBar(
        backgroundColor: KyveraTheme.cardDark,
        elevation: 2,
        title: const OrbitLogo(size: 32, showText: true),
        actions: [
          // Persona Switcher Dropdown
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: PopupMenuButton<String>(
              onSelected: (key) => app.switchRole(key),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: const BorderSide(color: Color(0xFF00B4D8), width: 1),
              ),
              color: KyveraTheme.cardDark,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFF070E17),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFF00B4D8).withOpacity(0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.shield_outlined, size: 16, color: Color(0xFF00B4D8)),
                    const SizedBox(width: 6),
                    Text(
                      app.currentUser.title,
                      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(width: 4),
                    const Icon(Icons.arrow_drop_down, size: 18, color: Colors.white70),
                  ],
                ),
              ),
              itemBuilder: (context) {
                return AppProvider.roles.entries.map((entry) {
                  final r = entry.value;
                  final isSelected = app.currentRoleKey == entry.key;
                  return PopupMenuItem<String>(
                    value: entry.key,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(r.title, style: TextStyle(fontWeight: isSelected ? FontWeight.bold : FontWeight.normal, color: Colors.white)),
                            Text('${r.name} • ${r.dept}', style: const TextStyle(fontSize: 10, color: Colors.white54)),
                          ],
                        ),
                        if (isSelected) const Icon(Icons.check, size: 16, color: Color(0xFF00B4D8)),
                      ],
                    ),
                  );
                }).toList();
              },
            ),
          ),
        ],
      ),
      body: Row(
        children: [
          // Sidebar for Desktop
          if (isDesktop)
            Container(
              width: 220,
              color: KyveraTheme.cardDark,
              child: Column(
                children: [
                  const SizedBox(height: 16),
                  _buildNavItem(context, app, 0, Icons.dashboard_outlined, 'Dashboard'),
                  _buildNavItem(context, app, 1, Icons.calendar_today_outlined, 'Leave Portal'),
                  _buildNavItem(context, app, 2, Icons.inventory_2_outlined, 'Materials'),
                  _buildNavItem(context, app, 3, Icons.swap_horiz_outlined, 'Work Transfer'),
                  _buildNavItem(context, app, 4, Icons.history, 'Audit Logs'),
                  _buildNavItem(context, app, 5, Icons.dns_outlined, 'SQL Self-Host'),
                ],
              ),
            ),
          // Main Body Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: pages[app.activeTab],
            ),
          ),
        ],
      ),
      // Bottom Navigation for Mobile
      bottomNavigationBar: isDesktop
          ? null
          : BottomNavigationBar(
              currentIndex: app.activeTab,
              onTap: (index) => app.setActiveTab(index),
              type: BottomNavigationBarType.fixed,
              backgroundColor: KyveraTheme.cardDark,
              selectedItemColor: KyveraTheme.cyanPrimary,
              unselectedItemColor: Colors.white54,
              selectedFontSize: 11,
              unselectedFontSize: 10,
              items: const [
                BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Home'),
                BottomNavigationBarItem(icon: Icon(Icons.calendar_today_outlined), label: 'Leaves'),
                BottomNavigationBarItem(icon: Icon(Icons.inventory_2_outlined), label: 'Material'),
                BottomNavigationBarItem(icon: Icon(Icons.swap_horiz_outlined), label: 'Tasks'),
                BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Logs'),
                BottomNavigationBarItem(icon: Icon(Icons.dns_outlined), label: 'SQL DB'),
              ],
            ),
    );
  }

  Widget _buildNavItem(BuildContext context, AppProvider app, int index, IconData icon, String title) {
    final isActive = app.activeTab == index;
    return ListTile(
      leading: Icon(icon, color: isActive ? KyveraTheme.cyanPrimary : Colors.white60, size: 20),
      title: Text(
        title,
        style: TextStyle(
          fontSize: 13,
          fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
          color: isActive ? Colors.white : Colors.white70,
        ),
      ),
      selected: isActive,
      selectedTileColor: const Color(0xFF00B4D8).withOpacity(0.15),
      onTap: () => app.setActiveTab(index),
    );
  }
}
