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