import 'package:flutter/material.dart';
import '../utils/theme.dart';

class SelfHostScreen extends StatelessWidget {
  const SelfHostScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.dns, color: KyveraTheme.greenPrimary, size: 22),
              SizedBox(width: 8),
              Text('100% Self-Hosted SQL & Private Backend', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
            ],
          ),
          const SizedBox(height: 8),
          const Text('All organization data remains strictly inside your own servers. Zero third-party cloud data dependencies.', style: TextStyle(fontSize: 12, color: Colors.white70)),
          const SizedBox(height: 16),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF070E17),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: KyveraTheme.cyanPrimary.withOpacity(0.4)),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('SQLite / PostgreSQL DDL (`backend/schema.sql`)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: KyveraTheme.cyanPrimary)),
                SizedBox(height: 8),
                SelectableText(
                  '''CREATE TABLE Employees (id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), role VARCHAR(50), department VARCHAR(100), email VARCHAR(100));
CREATE TABLE LeaveRequests (id VARCHAR(50) PRIMARY KEY, emp_id VARCHAR(50), from_date DATE, to_date DATE, leave_type VARCHAR(10), status VARCHAR(20));
CREATE TABLE MaterialRequests (id VARCHAR(50) PRIMARY KEY, emp_id VARCHAR(50), material_name VARCHAR(150), quantity VARCHAR(50), status VARCHAR(30));
CREATE TABLE WorkAssignments (id VARCHAR(50) PRIMARY KEY, from_dept VARCHAR(100), to_dept VARCHAR(100), hardware_details TEXT NOT NULL, doc_details TEXT NOT NULL, status VARCHAR(30));''',
                  style: TextStyle(fontFamily: 'monospace', fontSize: 10, color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF070E17),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: KyveraTheme.greenPrimary.withOpacity(0.4)),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Containerized One-Click Deployment (`docker-compose.yml`)', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: KyveraTheme.greenPrimary)),
                SizedBox(height: 6),
                SelectableText(
                  'docker-compose up -d',
                  style: TextStyle(fontFamily: 'monospace', fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
