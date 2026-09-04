// Boka reservation backend — receives requests from the website and
// sends the owner a WhatsApp message automatically via Twilio's API.
//
// This needs to be deployed somewhere (Render, Railway, Fly.io, a VPS...)
// before the frontend can call it. See README.md for setup steps.

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM,   // e.g. "whatsapp:+14155238886" (Twilio sandbox or your approved sender)
  OWNER_WHATSAPP_TO,      // e.g. "whatsapp:+355692020719"
  PORT = 3000
} = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/api/reservations', async (req, res) => {
  const { name, phone, date, party, note } = req.body || {};

  if (!name || !phone || !date) {
    return res.status(400).json({ ok: false, error: 'name, phone and date are required' });
  }

  const body =
    `New table request — Boka\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Date: ${date}\n` +
    `Party size: ${party || 'n/a'}\n` +
    (note ? `Note: ${note}\n` : '');

  try {
    await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: OWNER_WHATSAPP_TO,
      body
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('WhatsApp send failed:', err.message);
    res.status(500).json({ ok: false, error: 'Failed to send WhatsApp notification' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Boka reservation backend listening on ${PORT}`));
