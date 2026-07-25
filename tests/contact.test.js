const test = require('node:test');
const assert = require('node:assert/strict');
const { buildTelegramMessage } = require('../server');

test('buildTelegramMessage formats contact details for Telegram', () => {
  const payload = {
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    exam: 'NEET 2026',
    message: 'I want help with biology revision.'
  };

  const message = buildTelegramMessage(payload);

  assert.match(message, /Rahul Sharma/);
  assert.match(message, /rahul@example.com/);
  assert.match(message, /NEET 2026/);
  assert.match(message, /biology revision/);
  assert.match(message, /LastTopper Landing Page/);
});
