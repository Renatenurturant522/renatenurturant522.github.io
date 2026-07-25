const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/health', (_req, res) => {
  res.json({ ok: true, status: 'ready' });
});

function buildTelegramMessage({ name, email, exam, message }) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `*New Contact Message*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n🎯 *Exam:* ${exam}\n📝 *Message:*\n${message}\n\n🕒 *Time:* ${timestamp}\n🌐 *Source:* LastTopper Landing Page`;
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, exam, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
      return res.status(500).json({ ok: false, error: 'Telegram credentials are not configured' });
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildTelegramMessage({ name, email, exam, message }),
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      return res.status(502).json({ ok: false, error: data.description || 'Telegram delivery failed' });
    }

    return res.json({ ok: true, message: 'Contact message sent successfully' });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`LastTopper server listening on port ${port}`);
  });
}

module.exports = { app, buildTelegramMessage };
