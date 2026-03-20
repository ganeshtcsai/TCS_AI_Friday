<<<<<<< HEAD
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('patch.db');

// Create table
db.run(`CREATE TABLE IF NOT EXISTS patches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    severity TEXT,
    cvss INTEGER,
    risk_score INTEGER,
    recommendation TEXT,
    status TEXT DEFAULT 'Submitted'
)`);

// AI Logic
function calculateRisk(cvss, severity) {
    let risk = cvss * 10;
    if (severity === 'Critical') risk += 20;
    if (severity === 'High') risk += 10;

    let recommendation = 'Defer';
    if (risk > 80) recommendation = 'Auto-Approve';
    else if (risk > 50) recommendation = 'Review';

    return { risk, recommendation };
}

// Create Patch
app.post('/patch', (req, res) => {
    const { title, severity, cvss } = req.body;
    const ai = calculateRisk(cvss, severity);

    db.run(
        `INSERT INTO patches (title, severity, cvss, risk_score, recommendation) VALUES (?, ?, ?, ?, ?)`,
        [title, severity, cvss, ai.risk, ai.recommendation],
        function(err) {
            res.json({ id: this.lastID });
        }
    );
});

// Get all
app.get('/patches', (req, res) => {
    db.all("SELECT * FROM patches", [], (err, rows) => {
        res.json(rows);
    });
});

// Update Status
app.put('/patch/:id', (req, res) => {
    db.run(
        `UPDATE patches SET status=? WHERE id=?`,
        [req.body.status, req.params.id],
        () => res.json({ updated: true })
    );
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
=======
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create DB
const db = new sqlite3.Database("requests.db");

// Create Table
db.run(`
CREATE TABLE IF NOT EXISTS requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_name TEXT,
    employee_id TEXT,
    request_type TEXT,
    description TEXT,
    justification TEXT,
    priority TEXT,
    status TEXT,
    created_date TEXT
)
`);

// API: Create Request

app.post("/create-request", (req, res) => {
    const { employee_name, employee_id, request_type, description, justification, priority } = req.body;

    const query = `
    INSERT INTO requests 
    (employee_name, employee_id, request_type, description, justification, priority, status, created_date)
    VALUES (?, ?, ?, ?, ?, ?, 'Submitted', datetime('now'))
    `;

    db.run(query, [employee_name, employee_id, request_type, description, justification, priority], function(err) {
        if (err) return res.send(err);

        res.send({ message: "Request Created", id: this.lastID });
    });
});

// API: Get Requests
app.get("/requests", (req, res) => {
    db.all("SELECT * FROM requests", [], (err, rows) => {
        if (err) return res.send(err);
        res.send(rows);
    });
});

// Start server
app.use(express.static(path.join(__dirname)));

// Default route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});

// Status Update API
app.post("/update-status", (req, res) => {
    const { id, status } = req.body;

    db.run(`UPDATE requests SET status=? WHERE id=?`, [status, id], function(err) {
        if (err) return res.send(err);

        res.send({ message: "Status Updated" });
    });
});
>>>>>>> 90aa7c30558838ccf344a5b9c331aa4da338ed30
