import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../models/app_models.dart';
import '../utils/theme.dart';

class MaterialScreen extends StatelessWidget {
  const MaterialScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppProvider>();
    final isInventoryManager = app.currentUser.id == 'INVENTORY' || app.currentUser.id == 'CEO';

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Material Request & Stock Catalog', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: KyveraTheme.cyanPrimary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
                onPressed: () => _showRequestDialog(context, app),
                icon: const Icon(Icons.add_shopping_cart, size: 16),
                label: const Text('Request Material', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Catalog overview bar
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: KyveraTheme.cardDark,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: app.inventory.map((item) => Column(
                children: [
                  Text(item.name, style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white70)),
                  Text('Qty: ${item.qty} ${item.unit}', style: const TextStyle(fontSize: 11, color: KyveraTheme.cyanPrimary, fontWeight: FontWeight.bold)),
                ],
              )).toList(),
            ),
          ),
          const SizedBox(height: 16),

          ...app.materialRequests.map((req) => Container(
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
                    Text(req.materialName, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.white)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: req.status == 'Handed Over' ? KyveraTheme.greenPrimary.withOpacity(0.2) : KyveraTheme.importantAmber.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(req.status, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: req.status == 'Handed Over' ? KyveraTheme.greenPrimary : KyveraTheme.importantAmber)),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text('Requested by ${req.empName} (${req.empId}) • Qty: ${req.quantity}', style: const TextStyle(fontSize: 12, color: Colors.white70)),
                Text('Project: ${req.projectName} • Priority: ${req.priority}', style: const TextStyle(fontSize: 11, color: KyveraTheme.cyanPrimary)),
                
                if (isInventoryManager && req.status == 'Pending') ...[
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: KyveraTheme.greenPrimary, foregroundColor: Colors.white),
                        onPressed: () => app.updateMaterialStatus(req.id, 'Accepted', availability: 'Available'),
                        child: const Text('Accept & Issue Stock', style: TextStyle(fontSize: 11)),
                      ),
                      const SizedBox(width: 8),
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(foregroundColor: KyveraTheme.importantAmber),
                        onPressed: () => app.updateMaterialStatus(req.id, 'Ordered', availability: 'Out of Stock'),
                        child: const Text('Add to Purchase List', style: TextStyle(fontSize: 11)),
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

  void _showRequestDialog(BuildContext context, AppProvider app) {
    final matCtrl = TextEditingController();
    final qtyCtrl = TextEditingController(text: '1 pcs');
    final projCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: KyveraTheme.cardDark,
          title: const Text('Material Requisition', style: TextStyle(color: Colors.white)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: matCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: 'Material Name', labelStyle: TextStyle(color: Colors.white70)),
              ),
              TextField(
                controller: qtyCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: 'Quantity / Length', labelStyle: TextStyle(color: Colors.white70)),
              ),
              TextField(
                controller: projCtrl,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(labelText: 'Project Name', labelStyle: TextStyle(color: Colors.white70)),
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
                if (matCtrl.text.isNotEmpty && projCtrl.text.isNotEmpty) {
                  app.submitMaterialRequest(MaterialRequest(
                    id: 'MAT-2026-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
                    empId: app.currentUser.empId,
                    empName: app.currentUser.name,
                    dept: app.currentUser.dept,
                    materialName: matCtrl.text,
                    quantity: qtyCtrl.text,
                    projectName: projCtrl.text,
                    priority: 'Quick',
                    requestDate: DateTime.now().toString().substring(0, 16),
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
