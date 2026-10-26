// Vercel serverless function: emails the patient when the admin confirms / cancels / completes a booking.
// Secrets live in Vercel Environment Variables (never in the website files):
//   BREVO_API_KEY       (required)  Brevo → SMTP & API → API keys
//   BREVO_SENDER_EMAIL  (required)  a sender you verified in Brevo
//   BREVO_SENDER_NAME   (optional)  default "Cebu Dental Care Center"
//   REPLY_TO            (optional)  where patient replies go
//   ADMIN_EMAIL         (optional)  default admin@gmail.com
//   FIREBASE_API_KEY    (optional)  default = the public web API key of this project

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@gmail.com').toLowerCase();
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY || 'AIzaSyCLB6d4iiSid4dmGa09l2SMo47rKKC0CtY';
const CLINIC = { name: 'Cebu Dental Care Center', addr: 'Unit 13, R Aboitiz St, Cebu City, 6000 Cebu', phone: '(032) 253 3206', hours: 'Mon–Sat, 9:00 AM – 5:00 PM' };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = (n) => String(n).padStart(2, '0');

function to12(t) { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`; }
function longDate(s) { const [y, m, d] = s.split('-').map(Number); const dt = new Date(y, m - 1, d); return `${DOW[dt.getDay()]}, ${MONTHS[m - 1]} ${d}, ${y}`; }
function shortDate(s) { const [y, m, d] = s.split('-').map(Number); return `${MONTHS[m - 1].slice(0, 3)} ${d}, ${y}`; }

function gcalUrl(b) {
  const [y, m, d] = b.date.split('-').map(Number);
  const [sh, sm] = b.time.split(':').map(Number);
  const end = sh * 60 + sm + b.dur;
  const day = `${y}${pad(m)}${pad(d)}`;
  const e = encodeURIComponent;
  return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${e(`${b.serviceName} — ${CLINIC.name}`)}&dates=${day}T${pad(sh)}${pad(sm)}00/${day}T${pad(Math.floor(end / 60))}${pad(end % 60)}00` +
    `&ctz=${e('Asia/Manila')}&details=${e(`Reference ${b.ref} with ${b.doctorName}. Call ${CLINIC.phone} to confirm or reschedule.`)}&location=${e(CLINIC.addr)}`;
}

function buildEmail(status, b, note, siteUrl) {
  const copy = {
    confirmed: { subject: `Appointment confirmed — ${shortDate(b.date)}, ${to12(b.time)} (${b.ref})`, color: '#0b5d55', title: 'Your appointment is confirmed',
      lead: `Hi ${esc(b.name)}, good news — the clinic has confirmed your appointment. Your receipt is below.` },
    cancelled: { subject: `Appointment cancelled (${b.ref})`, color: '#b91c1c', title: 'Your appointment was cancelled',
      lead: `Hi ${esc(b.name)}, your appointment request below has been cancelled. You can book a new time on our website or call us.` },
    completed: { subject: `Thank you for visiting ${CLINIC.name}`, color: '#0b5d55', title: 'Thank you for your visit',
      lead: `Hi ${esc(b.name)}, thank you for trusting us with your smile. Here is a summary of your visit.` }
  }[status];

  const qrData = `${siteUrl}/admin.html?ref=${encodeURIComponent(b.ref)}`;
  const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(qrData)}`;
  const row = (k, v) => `<tr><td style="padding:9px 0;color:#6c807d;font-size:14px;border-bottom:1px dashed #dfe7e4">${k}</td><td style="padding:9px 0;text-align:right;font-weight:700;font-size:14px;border-bottom:1px dashed #dfe7e4">${v}</td></tr>`;

  const html = `<!doctype html><html><body style="margin:0;background:#f3f6f4;font-family:Segoe UI,Arial,sans-serif;color:#0a1f1c">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6f4;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e1e9e6">
<tr><td style="background:${copy.color};padding:22px 26px;color:#ffffff"><div style="font-size:20px;font-weight:800">${CLINIC.name}</div><div style="font-size:13px;opacity:.85;margin-top:2px">Appointment update</div></td></tr>
<tr><td style="padding:26px">
<h1 style="margin:0 0 8px;font-size:22px;color:${copy.color}">${copy.title}</h1>
<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#3d5250">${copy.lead}</p>
${note ? `<div style="background:#eef8f5;border-left:4px solid #0b5d55;border-radius:8px;padding:12px 14px;margin:0 0 18px;font-size:14px;line-height:1.55"><b style="display:block;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#0b5d55;margin-bottom:4px">Message from the clinic</b>${esc(note).replace(/\n/g, '<br>')}</div>` : ''}
${status === 'confirmed' ? `<div style="text-align:center;margin:6px 0 18px">
<img src="${qrImg}" width="200" height="200" alt="Booking QR code" style="display:block;margin:0 auto;border:1px solid #e1e9e6;border-radius:12px">
<div style="font-family:Consolas,Menlo,monospace;font-size:20px;font-weight:800;margin-top:10px;letter-spacing:.04em">${esc(b.ref)}</div>
<div style="font-size:13px;color:#6c807d;margin-top:4px">Show this QR code or reference at the front desk.</div></div>` : `<div style="font-family:Consolas,Menlo,monospace;font-size:16px;font-weight:800;margin:0 0 12px">${esc(b.ref)}</div>`}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 6px">
${row('Treatment', esc(b.serviceName))}${row('Dentist', esc(b.doctorName))}${row('Date', esc(longDate(b.date)))}${row('Time', esc(to12(b.time)) + ' (PHT)')}${row('Chair time', esc(b.dur) + ' minutes')}${row('Patient', esc(b.name))}${row('Mobile', esc(b.phone))}${row('Status', `<span style="color:${copy.color}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`)}
</table>
${status === 'confirmed' ? `<div style="text-align:center;margin:20px 0 4px"><a href="${esc(gcalUrl(b))}" style="display:inline-block;background:#0b5d55;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:999px">Add to Google Calendar</a></div>` : ''}
${status === 'cancelled' ? `<div style="text-align:center;margin:20px 0 4px"><a href="${esc(siteUrl)}/#book" style="display:inline-block;background:#0b5d55;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:999px">Book a new time</a></div>` : ''}
</td></tr>
<tr><td style="padding:16px 26px 24px;border-top:1px solid #eef2f0;font-size:12.5px;line-height:1.6;color:#6c807d;text-align:center">${CLINIC.name} · ${CLINIC.addr}<br>${CLINIC.phone} · ${CLINIC.hours}</td></tr>
</table></td></tr></table></body></html>`;

  const text = [copy.title, '', `Reference: ${b.ref}`, `Treatment: ${b.serviceName}`, `Dentist: ${b.doctorName}`, `Date: ${longDate(b.date)}`,
    `Time: ${to12(b.time)} (PHT)`, `Patient: ${b.name}`, note ? `\nMessage from the clinic: ${note}` : '', '', `${CLINIC.name} · ${CLINIC.addr} · ${CLINIC.phone}`].join('\n');
  return { subject: copy.subject, html, text };
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });

  try {
    // 1) only the logged-in admin may send emails
    const m = /^Bearer (.+)$/.exec(req.headers.authorization || '');
    if (!m) return res.status(401).json({ error: 'Not logged in.' });
    const who = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken: m[1] })
    });
    if (!who.ok) return res.status(401).json({ error: 'Login expired. Please log in again.' });
    const u = ((await who.json()).users || [])[0];
    const isAdmin = u && String(u.email || '').toLowerCase() === ADMIN_EMAIL && (u.providerUserInfo || []).some((p) => p.providerId === 'password');
    if (!isAdmin) return res.status(403).json({ error: 'Admin only.' });

    // 2) validate input
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const b = body.booking || {};
    const status = body.status;
    const note = String(body.note || '').slice(0, 600).trim();
    const siteUrl = String(body.siteUrl || '').replace(/\/+$/, '');
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ error: 'Bad status.' });
    if (!/^https?:\/\/[^\s]+$/.test(siteUrl)) return res.status(400).json({ error: 'Bad site URL.' });
    const ok = /^[A-Za-z0-9-]{4,40}$/.test(String(b.ref)) && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(b.email)) &&
      /^\d{4}-\d{2}-\d{2}$/.test(String(b.date)) && /^\d{2}:\d{2}$/.test(String(b.time)) && Number(b.dur) >= 5 && Number(b.dur) <= 480 &&
      b.name && b.serviceName && b.doctorName;
    if (!ok) return res.status(400).json({ error: 'Incomplete booking details.' });
    const booking = { ref: String(b.ref), name: String(b.name).slice(0, 120), email: String(b.email), phone: String(b.phone || '').slice(0, 40),
      serviceName: String(b.serviceName).slice(0, 120), doctorName: String(b.doctorName).slice(0, 120), date: b.date, time: b.time, dur: Number(b.dur) };

    // 3) send through Brevo
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) return res.status(500).json({ error: 'Email is not configured on the server (BREVO_API_KEY / BREVO_SENDER_EMAIL).' });
    const mail = buildEmail(status, booking, note, siteUrl);
    const payload = {
      sender: { name: process.env.BREVO_SENDER_NAME || CLINIC.name, email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: booking.email, name: booking.name }],
      subject: mail.subject, htmlContent: mail.html, textContent: mail.text
    };
    if (process.env.REPLY_TO) payload.replyTo = { email: process.env.REPLY_TO, name: CLINIC.name };
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' }, body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: `Brevo rejected the email (${r.status}). ${t.slice(0, 200)}` });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + (err && err.message || 'unknown') });
  }
};
