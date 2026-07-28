# KYVERA by MRA – Enterprise Workforce & Inventory Management (MVP)

**KYVERA** is a centralized enterprise workforce management platform developed by **MRA** that unifies employee leave management, material requests & inventory operations, inter-departmental work transfers, and activity audit logging into a single high-performance system.

> **Tagline**: CONNECT • COORDINATE • COMPLETE  
> **Privacy Guarantee**: 100% Self-Hosted. Your database and data remain strictly under your control on your own servers with zero cloud vendor dependencies.

---

## Key Features

1. **Employee Authentication & Multi-Role Access**:
   - CEO / Founder, HR Manager, Project Coordinator, Team Lead, Employee, Inventory Manager.
2. **Leave Management Module**:
   - Employee submission (EL/CL, Emergency level, Contact details).
   - HR approval workflow, leave balance tracker, CSV/Excel export.
3. **Material Request & Inventory Module**:
   - Stock tracking, incoming request management, vendor purchase lists, handover delivery updates.
4. **Work Transfer & Task Tracking**:
   - Department-to-department work assignment with **mandatory Hardware & Documentation verification**.
   - Receiver handshake, progress slider, completed state notification.
5. **Activity Audit Trail**:
   - Centralized searchable log repository for Leave, Material, and Work activity.
6. **100% Self-Hosted Database Architecture**:
   - Full SQL database DDL (`backend/schema.sql` for SQLite / PostgreSQL / MySQL).
   - Express REST API backend (`backend/server.js`).
   - Docker container setup (`backend/docker-compose.yml`).

---

## Local Development Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run the frontend web/mobile application (Vite)
npm run dev

# 3. (Optional) Run the local backend REST API server
npm run server
```

The web application will launch at `http://localhost:3000`.

---

## GitHub Deployment

To push this repository to your GitHub repo (`https://github.com/mohdasmabegum/KYVERA.git`):

```bash
git init
git add .
git commit -m "Initial commit - KYVERA by MRA Workforce MVP"
git branch -M main
git remote add origin https://github.com/mohdasmabegum/KYVERA.git
git push -u origin main
```
