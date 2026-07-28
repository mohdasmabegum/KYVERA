const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory / File persistence mock engine for standalone zero-dep local running
const DATA_FILE = path.join(__dirname, 'db_data.json');

const defaultData = {
  employees: [
    { id: 'MRA-001', name: 'Dr. Rajesh Varma', role: 'CEO', department: 'Executive', email: 'rajesh@mra.com' },
    { id: 'MRA-002', name: 'Ananya Sharma', role: 'HR', department: 'Human Resources', email: 'ananya@mra.com' },
    { id: 'MRA-003', name: 'Vikram Seth', role: 'COORDINATOR', department: 'Operations', email: 'vikram@mra.com' },
    { id: 'MRA-004', name: 'Arjun Mehta', role: 'TEAM_LEAD', department: 'Engineering', email: 'arjun@mra.com' },
    { id: 'MRA-005', name: 'Suresh Kumar', role: 'EMPLOYEE', department: 'Engineering', email: 'suresh@mra.com' },
    { id: 'MRA-006', name: 'Priya Nair', role: 'INVENTORY', department: 'Supply Chain', email: 'priya@mra.com' }
  ],
  leaveRequests: [],
  materialRequests: [],
  inventory: [],
  workAssignments: [],
  activityLogs: []
};

function getDbData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return defaultData;
  }
}

function saveDbData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'HEALTHY', system: 'KYVERA by MRA Self-Hosted Backend Engine v1.0' });
});

// Leave Endpoints
app.get('/api/leaves', (req, res) => {
  const data = getDbData();
  res.json(data.leaveRequests);
});

app.post('/api/leaves', (req, res) => {
  const data = getDbData();
  const newLeave = { id: `LV-${Date.now()}`, ...req.body, appliedDate: new Date().toISOString() };
  data.leaveRequests.unshift(newLeave);
  saveDbData(data);
  res.json({ success: true, data: newLeave });
});

// Material Endpoints
app.get('/api/material', (req, res) => {
  const data = getDbData();
  res.json(data.materialRequests);
});

// Work Transfer Endpoints
app.get('/api/work', (req, res) => {
  const data = getDbData();
  res.json(data.workAssignments);
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  KYVERA by MRA - Self-Hosted Backend Listening on Port ${PORT}`);
  console.log(`  Data storage: Local SQL / JSON Engine (Privacy Assured)`);
  console.log(`=======================================================`);
});
