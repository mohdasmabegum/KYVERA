import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/app_provider.dart';
import 'screens/main_screen.dart';
import 'utils/theme.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppProvider(),
      child: const KyveraApp(),
    ),
  );
}

class KyveraApp extends StatelessWidget {
  const KyveraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KYVERA by MRA | Enterprise Workforce',
      debugShowCheckedModeBanner: false,
      theme: KyveraTheme.darkTheme,
      home: const MainScreen(),
    );
  }
}
