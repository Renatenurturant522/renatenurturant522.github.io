const test = require('node:test');
const assert = require('node:assert/strict');
const { buildTelegramMessage, app } = require('../server');

let server;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
});

test.after(async () => {
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
});

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

test('health endpoint responds successfully', async () => {
  const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
});
