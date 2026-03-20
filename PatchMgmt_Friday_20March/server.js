const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
app.use(express.json());
app.use(express.static('public'));

console.log("🚀 Starting server...");

// Setup DB
const db = new Low(new JSONFile('db.json'), { patches: [] });

async function initDB() {
    await db.read();
    db.data ||= { patches: [] };
    await db.write();
}
initDB();

// AI Logic
function calculateRisk(cvss, severity) {
    cvss = Number(cvss);
    let risk = cvss * 10;

    if (severity === 'Critical') risk += 20;
    if (severity === 'High') risk += 10;

    let recommendation = 'Defer';
    if (risk > 80) recommendation = 'Auto-Approve';
    else if (risk > 50) recommendation = 'Review';

    return { risk, recommendation };
}

// Create Patch
app.post('/patch', async (req, res) => {
    await db.read();

    const { title, severity, cvss } = req.body;
    const ai = calculateRisk(cvss, severity);

    const newPatch = {
        id: Date.now(),
        title,
        severity,
        cvss,
        risk_score: ai.risk,
        recommendation: ai.recommendation,
        status: 'Submitted'
    };

    db.data.patches.push(newPatch);
    await db.write();

    res.json(newPatch);
});

// Get all patches
app.get('/patches', async (req, res) => {
    await db.read();
    res.json(db.data.patches);
});

// Update status
app.put('/patch/:id', async (req, res) => {
    await db.read();

    const patch = db.data.patches.find(p => p.id == req.params.id);
    if (patch) {
        patch.status = req.body.status;
        await db.write();
    }

    res.json({ updated: true });
});

// Start server
app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
});