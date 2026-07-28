import 'package:flutter/material.dart';

class OrbitLogo extends StatefulWidget {
  final double size;
  final bool showText;

  const OrbitLogo({super.key, this.size = 40.0, this.showText = true});

  @override
  State<OrbitLogo> createState() => _OrbitLogoState();
}

class _OrbitLogoState extends State<OrbitLogo> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 18),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            // Orbit Ring Animation
            RotationTransition(
              turns: _controller,
              child: Container(
                width: widget.size + 14,
                height: widget.size + 14,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: const Color(0xFF00B4D8).withOpacity(0.35),
                    width: 1.5,
                  ),
                ),
                child: Stack(
                  children: [
                    Positioned(
                      top: 0,
                      left: (widget.size + 14) / 2 - 4,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF00B4D8),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      left: (widget.size + 14) / 2 - 4,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Color(0xFF10B981),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Logo Image
            ClipOval(
              child: Image.asset(
                'assets/logo.png',
                width: widget.size,
                height: widget.size,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: widget.size,
                    height: widget.size,
                    decoration: const BoxDecoration(
                      color: Color(0xFF0A192F),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.hub, color: Color(0xFF00B4D8)),
                  );
                },
              ),
            ),
          ],
        ),
        if (widget.showText) ...[
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Text(
                    'KYVERA',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0A2540),
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: const Color(0xFF00B4D8).withOpacity(0.5)),
                    ),
                    child: const Text(
                      'BY MRA',
                      style: TextStyle(
                        fontSize: 9,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF00B4D8),
                      ),
                    ),
                  ),
                ],
              ),
              const Text(
                'CONNECT • COORDINATE • COMPLETE',
                style: TextStyle(
                  fontSize: 8,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF10B981),
                  letterSpacing: 1.0,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
