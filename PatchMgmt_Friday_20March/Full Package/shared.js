/* ═══════════════════════════════════════════════
   PatchIQ Enterprise — Shared Data & Utilities
   All pages import this file
═══════════════════════════════════════════════ */

// ── LIVE CLOCK ──
function startClock(id) {
  const el = document.getElementById(id);
  if (!el) return;
  setInterval(() => {
    el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
  }, 1000);
}

// ── COUNTER ANIMATION ──
function animateCount(el, target, suffix = '', duration = 1400) {
  const start = Date.now();
  const timer = setInterval(() => {
    const p = Math.min((Date.now() - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target).toLocaleString() + suffix;
    if (p >= 1) clearInterval(timer);
  }, 16);
}

// ── TOAST NOTIFICATIONS ──
function showToast(msg, type = 'info') {
  const colors = { info: '#00f5ff', success: '#00ff88', warning: '#ff8c00', danger: '#ff2d55' };
  let wrap = document.getElementById('toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.style.cssText = 'position:fixed;top:68px;right:18px;z-index:9999;display:flex;flex-direction:column;gap:8px';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.style.cssText = `background:#060d14;border:1px solid ${colors[type]};border-radius:10px;padding:13px 18px;
    font-family:'JetBrains Mono',monospace;font-size:11px;max-width:300px;color:${colors[type]};
    animation:toastIn .3s ease;box-shadow:0 0 20px ${colors[type]}33`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ── MODAL SYSTEM ──
function openModal(title, bodyHTML, footerHTML = '') {
  let overlay = document.getElementById('globalModal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'globalModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:8000;display:flex;justify-content:center;align-items:center;backdrop-filter:blur(4px)';
    overlay.innerHTML = `<div style="background:#091422;border:1px solid rgba(0,245,255,.45);border-radius:18px;padding:30px;max-width:680px;width:92%;max-height:82vh;overflow-y:auto;position:relative">
      <button onclick="closeModal()" style="position:absolute;top:14px;right:16px;background:none;border:none;color:#6a9db8;font-size:20px;cursor:pointer">✕</button>
      <div id="modalTitle" style="font-family:'Orbitron',sans-serif;font-size:17px;color:#00f5ff;margin-bottom:20px"></div>
      <div id="modalBody"></div>
      <div id="modalFooter" style="margin-top:18px"></div>
    </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  document.getElementById('modalTitle').innerHTML = title;
  document.getElementById('modalBody').innerHTML = bodyHTML;
  document.getElementById('modalFooter').innerHTML = footerHTML;
  overlay.style.display = 'flex';
}
function closeModal() {
  const m = document.getElementById('globalModal');
  if (m) m.style.display = 'none';
}

// ── SHARED DATA STORE (localStorage-backed) ──
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('piq_' + key)); } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem('piq_' + key, JSON.stringify(val));
  },
  getOrDefault(key, def) {
    const v = this.get(key);
    return v !== null ? v : def;
  }
};

// ── ENDPOINTS DATA ──
const ENDPOINTS_DEFAULT = [
  { id: 'EP-001', name: 'DESKTOP-WIN-001', os: 'Windows 11', dept: 'Finance', user: 'Ananya Sharma', status: 'Patched', lastPatch: '2025-03-18', risk: 12, ip: '10.1.1.101', compliance: 98 },
  { id: 'EP-002', name: 'DESKTOP-WIN-002', os: 'Windows 10', dept: 'HR', user: 'Rajesh Kumar', status: 'Patched', lastPatch: '2025-03-18', risk: 15, ip: '10.1.1.102', compliance: 96 },
  { id: 'EP-003', name: 'LAPTOP-MAC-001', os: 'macOS 14', dept: 'Engineering', user: 'Priya Nair', status: 'Pending', lastPatch: '2025-03-10', risk: 44, ip: '10.1.2.10', compliance: 78 },
  { id: 'EP-004', name: 'SRV-LINUX-001', os: 'Ubuntu 22.04', dept: 'IT', user: 'System', status: 'Patched', lastPatch: '2025-03-19', risk: 8, ip: '10.2.1.1', compliance: 99 },
  { id: 'EP-005', name: 'SRV-LINUX-002', os: 'RHEL 9', dept: 'DevOps', user: 'System', status: 'Patched', lastPatch: '2025-03-17', risk: 10, ip: '10.2.1.2', compliance: 97 },
  { id: 'EP-006', name: 'DESKTOP-WIN-003', os: 'Windows 11', dept: 'Sales', user: 'Vikram Mehta', status: 'Patched', lastPatch: '2025-03-18', risk: 18, ip: '10.1.1.103', compliance: 95 },
  { id: 'EP-007', name: 'MOBILE-IOS-001', os: 'iOS 17.4', dept: 'Management', user: 'Deepa Iyer', status: 'Pending', lastPatch: '2025-03-05', risk: 52, ip: '10.3.1.5', compliance: 72 },
  { id: 'EP-008', name: 'LAPTOP-WIN-001', os: 'Windows 11', dept: 'Finance', user: 'Suresh Patel', status: 'Patched', lastPatch: '2025-03-18', risk: 11, ip: '10.1.3.20', compliance: 98 },
  { id: 'EP-009', name: 'SRV-VMWARE-001', os: 'VMware ESXi 8', dept: 'IT', user: 'System', status: 'Critical', lastPatch: '2025-02-20', risk: 93, ip: '10.2.2.1', compliance: 41 },
  { id: 'EP-010', name: 'SRV-EXCH-001', os: 'Windows Server 2022', dept: 'IT', user: 'System', status: 'Critical', lastPatch: '2025-02-28', risk: 88, ip: '10.2.3.1', compliance: 45 },
  { id: 'EP-011', name: 'DESKTOP-WIN-004', os: 'Windows 10', dept: 'Legal', user: 'Meena Krishnan', status: 'Patched', lastPatch: '2025-03-18', risk: 20, ip: '10.1.1.104', compliance: 94 },
  { id: 'EP-012', name: 'LAPTOP-MAC-002', os: 'macOS 13', dept: 'Design', user: 'Arjun Reddy', status: 'Pending', lastPatch: '2025-03-08', risk: 38, ip: '10.1.2.11', compliance: 80 },
  { id: 'EP-013', name: 'MOBILE-AND-001', os: 'Android 14', dept: 'Sales', user: 'Kavya Singh', status: 'Pending', lastPatch: '2025-03-01', risk: 60, ip: '10.3.2.1', compliance: 65 },
  { id: 'EP-014', name: 'IOT-CAM-001', os: 'Embedded Linux', dept: 'Security', user: 'System', status: 'Critical', lastPatch: '2025-01-15', risk: 78, ip: '10.4.1.1', compliance: 30 },
  { id: 'EP-015', name: 'SRV-LINUX-003', os: 'Ubuntu 20.04', dept: 'Analytics', user: 'System', status: 'Patched', lastPatch: '2025-03-19', risk: 12, ip: '10.2.1.3', compliance: 97 },
];

// ── CVE DATA ──
const CVE_DEFAULT = [
  { id: 'CVE-2025-0847', prod: 'Windows Kernel', platform: 'Windows', sev: 'CRITICAL', cvss: 9.8, epss: 82, risk: 97, dev: 4821, sla: '<4h', status: 'Deploying', decision: 'Auto-Approve', kev: true, published: '2025-03-15', description: 'Kernel privilege escalation vulnerability allowing local attackers to gain SYSTEM-level access via crafted API calls.' },
  { id: 'CVE-2025-2199', prod: 'Exchange Server', platform: 'Windows', sev: 'CRITICAL', cvss: 9.1, epss: 74, risk: 94, dev: 210, sla: '<4h', status: 'Approved', decision: 'Auto-Approve', kev: true, published: '2025-03-10', description: 'Remote code execution in Exchange Server via malformed MIME parsing. No authentication required.' },
  { id: 'CVE-2025-5001', prod: 'VMware ESXi', platform: 'Linux', sev: 'CRITICAL', cvss: 9.6, epss: 69, risk: 93, dev: 88, sla: '<4h', status: 'Pending', decision: 'Auto-Approve', kev: true, published: '2025-03-08', description: 'Heap overflow in VMware ESXi hypervisor enabling guest-to-host escape attacks.' },
  { id: 'CVE-2025-1234', prod: 'Chrome V8 RCE', platform: 'Windows', sev: 'HIGH', cvss: 8.6, epss: 61, risk: 85, dev: 12440, sla: '48h', status: 'Deploying', decision: 'Auto-Approve', kev: false, published: '2025-03-12', description: 'Type confusion in V8 JavaScript engine allowing remote code execution via crafted web pages.' },
  { id: 'CVE-2025-0220', prod: 'iOS Kernel', platform: 'Mobile', sev: 'HIGH', cvss: 8.0, epss: 52, risk: 78, dev: 2100, sla: '48h', status: 'Deploying', decision: 'Auto-Approve', kev: true, published: '2025-03-18', description: 'iOS kernel vulnerability allowing privilege escalation from sandboxed app to kernel level.' },
  { id: 'CVE-2025-4002', prod: 'OpenSSH', platform: 'Linux', sev: 'HIGH', cvss: 8.1, epss: 55, risk: 80, dev: 630, sla: '48h', status: 'Approved', decision: 'Auto-Approve', kev: false, published: '2025-03-11', description: 'Signal handler race condition in OpenSSH sshd allowing unauthenticated remote code execution.' },
  { id: 'CVE-2025-5318', prod: 'Adobe Acrobat', platform: 'Windows', sev: 'HIGH', cvss: 7.8, epss: 48, risk: 74, dev: 8920, sla: '48h', status: 'Pending', decision: 'Auto-Approve', kev: false, published: '2025-03-09', description: 'Use-after-free in Adobe Acrobat PDF parser enabling arbitrary code execution.' },
  { id: 'CVE-2025-3301', prod: 'Apache Log4j2', platform: 'Linux', sev: 'HIGH', cvss: 7.5, epss: 41, risk: 70, dev: 45, sla: '48h', status: 'Approved', decision: 'Auto-Approve', kev: false, published: '2025-03-07', description: 'Remote code execution via JNDI lookup injection in Apache Log4j2 logging framework.' },
  { id: 'CVE-2025-1100', prod: 'Firefox', platform: 'Windows', sev: 'HIGH', cvss: 7.2, epss: 38, risk: 67, dev: 5500, sla: '48h', status: 'Pending', decision: 'Auto-Approve', kev: false, published: '2025-03-14', description: 'Memory corruption in Firefox SpiderMonkey JS engine enabling potential code execution.' },
  { id: 'CVE-2025-3800', prod: 'Java Runtime', platform: 'Cross-Platform', sev: 'MEDIUM', cvss: 6.1, epss: 28, risk: 51, dev: 3400, sla: '7d', status: 'Pending', decision: 'Defer', kev: false, published: '2025-03-06', description: 'Deserialization vulnerability in Java Runtime Environment allowing privilege escalation.' },
  { id: 'CVE-2025-4482', prod: 'OpenSSL', platform: 'Linux', sev: 'MEDIUM', cvss: 5.3, epss: 22, risk: 44, dev: 890, sla: '7d', status: 'Deferred', decision: 'Defer', kev: false, published: '2025-03-04', description: 'Denial-of-service vulnerability in OpenSSL certificate parsing requiring local access.' },
  { id: 'CVE-2025-2900', prod: 'WinRAR', platform: 'Windows', sev: 'LOW', cvss: 4.2, epss: 8, risk: 22, dev: 620, sla: '30d', status: 'Deferred', decision: 'Defer', kev: false, published: '2025-03-01', description: 'Path traversal in WinRAR archive extraction allowing overwrite of arbitrary files.' },
];

// ── ITSM TICKETS ──
const TICKETS_DEFAULT = [
  { id: 'INC-2025-04821', cve: 'CVE-2025-0847', title: 'Windows Kernel Privilege Escalation — Critical Patch', sev: 'CRITICAL', status: 'Deploying', progress: 68, created: '2025-03-19 09:12', assignee: 'AI Engine', ring: 'Broad', devices: 4821, auto: true, notes: '' },
  { id: 'INC-2025-04700', cve: 'CVE-2025-2199', title: 'Exchange Server RCE — Emergency Patch', sev: 'CRITICAL', status: 'Approved', progress: 45, created: '2025-03-19 06:30', assignee: 'AI Engine', ring: 'Pilot', devices: 210, auto: true, notes: '' },
  { id: 'INC-2025-04633', cve: 'MS-ROLLUP', title: 'Monthly Windows Security Rollup — March 2025', sev: 'HIGH', status: 'Deploying', progress: 88, created: '2025-03-18 22:00', assignee: 'AI Engine', ring: 'Broad', devices: 18400, auto: true, notes: '' },
  { id: 'INC-2025-04521', cve: 'CVE-2025-1234', title: 'Chrome V8 RCE — 12,440 Endpoints', sev: 'HIGH', status: 'Deploying', progress: 55, created: '2025-03-19 04:00', assignee: 'AI Engine', ring: 'Broad', devices: 12440, auto: true, notes: '' },
  { id: 'INC-2025-04410', cve: 'CVE-2025-4002', title: 'Linux OpenSSH Patch — Server Farm', sev: 'HIGH', status: 'Closed', progress: 100, created: '2025-03-18 10:00', assignee: 'AI Engine', ring: 'Enterprise', devices: 630, auto: true, notes: '' },
  { id: 'INC-2025-04300', cve: 'CVE-2025-5318', title: 'Adobe Acrobat Update — 8,920 Devices', sev: 'MEDIUM', status: 'Pending', progress: 20, created: '2025-03-17 14:00', assignee: 'Unassigned', ring: 'Pilot', devices: 8920, auto: false, notes: '' },
  { id: 'INC-2025-04200', cve: 'CVE-2025-0220', title: 'iOS 18.4 Security Update — Mobile Fleet', sev: 'HIGH', status: 'Deploying', progress: 61, created: '2025-03-19 07:00', assignee: 'AI Engine', ring: 'Broad', devices: 2100, auto: true, notes: '' },
  { id: 'INC-2025-04100', cve: 'CVE-2025-4482', title: 'OpenSSL DoS — Deferred per AI Policy', sev: 'MEDIUM', status: 'Deferred', progress: 0, created: '2025-03-18 08:00', assignee: 'AI Engine', ring: 'N/A', devices: 890, auto: true, notes: 'Deferred: EPSS 22% < 30% threshold. Re-evaluate in 7 days.' },
  { id: 'INC-2025-03900', cve: 'CVE-2025-5001', title: 'VMware ESXi Critical — 88 Servers', sev: 'CRITICAL', status: 'Approved', progress: 30, created: '2025-03-19 08:00', assignee: 'AI Engine', ring: 'Pilot', devices: 88, auto: true, notes: '' },
];

// ── PATCH POLICIES ──
const POLICIES_DEFAULT = [
  { id: 'POL-001', name: 'Critical Auto-Deploy', severity: 'CRITICAL', action: 'Auto-Approve', sla: '4 hours', ring: 'Pilot → Broad → Enterprise', active: true },
  { id: 'POL-002', name: 'High Priority Deploy', severity: 'HIGH', action: 'Auto-Approve', sla: '48 hours', ring: 'Pilot → Broad', active: true },
  { id: 'POL-003', name: 'Medium Scheduled', severity: 'MEDIUM', action: 'Schedule', sla: '7 days', ring: 'Pilot → Broad', active: true },
  { id: 'POL-004', name: 'Low Deferred', severity: 'LOW', action: 'Defer', sla: '30 days', ring: 'Enterprise only', active: true },
  { id: 'POL-005', name: 'CISA KEV Immediate', severity: 'ANY', action: 'Force Deploy', sla: '2 hours', ring: 'All Rings Parallel', active: true },
];

// ── SHARED HELPER: SEVERITY COLOR ──
function sevColor(s) {
  return { CRITICAL: '#ff2d55', HIGH: '#ff8c00', MEDIUM: '#ffd700', LOW: '#00ff88' }[s] || '#aaa';
}
function riskColor(r) {
  return r >= 90 ? '#ff2d55' : r >= 70 ? '#ff8c00' : r >= 50 ? '#ffd700' : '#00ff88';
}
function statusColor(s) {
  const m = { Patched: '#00ff88', Approved: '#00ff88', Deploying: '#00f5ff', Pending: '#ffd700', Critical: '#ff2d55', Deferred: '#aaa', Closed: '#00ff88', Failed: '#ff2d55' };
  return m[s] || '#aaa';
}

// Add CSS animation for toasts
if (!document.getElementById('sharedStyles')) {
  const style = document.createElement('style');
  style.id = 'sharedStyles';
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}';
  document.head.appendChild(style);
}
