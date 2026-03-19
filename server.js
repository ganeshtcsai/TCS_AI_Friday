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