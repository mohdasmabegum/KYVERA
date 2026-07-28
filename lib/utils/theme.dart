import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class KyveraTheme {
  static const Color bgDark = Color(0xFF070E17);
  static const Color cardDark = Color(0xFF0E1C2E);
  static const Color borderDark = Color(0x1FFFFFFF);

  static const Color cyanPrimary = Color(0xFF00B4D8);
  static const Color tealPrimary = Color(0xFF00C49F);
  static const Color greenPrimary = Color(0xFF10B981);
  static const Color navyPrimary = Color(0xFF0A192F);

  static const Color emergencyRed = Color(0xFFFB7185);
  static const Color importantAmber = Color(0xFFFBBF24);
  static const Color generalCyan = Color(0xFF38BDF8);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: bgDark,
      primaryColor: cyanPrimary,
      colorScheme: const ColorScheme.dark(
        primary: cyanPrimary,
        secondary: greenPrimary,
        surface: cardDark,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        ThemeData.dark().textTheme,
      ),
      cardTheme: CardThemeData(
        color: cardDark,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderDark, width: 1),
        ),
      ),
    );
  }
}
