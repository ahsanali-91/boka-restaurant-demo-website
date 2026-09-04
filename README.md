# Boka reservation backend (optional upgrade)

The website already sends reservation requests straight to the owner's
WhatsApp with **zero setup**, using a `wa.me` link the guest's browser opens.
That works today, on any device, for free.

This backend is the next step up: it lets the site POST a reservation to a
server, which then messages the owner automatically — so the notification
arrives even if the guest doesn't have WhatsApp installed on that device, or
never taps the button themselves.

## What it needs

WhatsApp doesn't offer a plain email/SMS-style API — messages have to go
through an approved provider. This starter uses **Twilio's WhatsApp API**,
the fastest way to get one working:

1. Create a free Twilio account: https://www.twilio.com/try-twilio
2. Activate the WhatsApp Sandbox (Console → Messaging → Try it out →
   Send a WhatsApp message) and follow the "join" instructions from the
   owner's WhatsApp number — this links their number to the sandbox for
   testing.
3. Copy `.env.example` to `.env` and fill in:
   - `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` — from the Twilio console
   - `TWILIO_WHATSAPP_FROM` — the sandbox number Twilio gives you
   - `OWNER_WHATSAPP_TO` — the owner's WhatsApp number, `whatsapp:+355692020719`
4. Install and run:
   ```
   npm install
   npm start
   ```
5. Deploy it somewhere it can stay running (Render, Railway, Fly.io all have
   free tiers) so it has a public URL.
6. In `boka-restaurant.html`, uncomment the `fetch(...)` block inside the
   reservation form handler and point it at
   `https://<your-deployed-backend>/api/reservations`.

## Going to production

The sandbox is for testing only — messages need the owner to "join" it and
Twilio prefixes them with a sandbox notice. For a real, branded number
without that limitation, apply for a Twilio WhatsApp Sender (or use Meta's
WhatsApp Cloud API directly) — both require business verification, which
only the business owner can complete.
