const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { healOrphanedToolCalls } = require('../bin/pisesh');

function entry(id, parentId, message) {
  return { type: 'message', id, parentId, timestamp: '2026-07-20T00:00:00.000Z', message };
}

function assistant(id, stopReason, callId) {
  return entry(id, 'root', {
    role: 'assistant',
    content: [{ type: 'toolCall', id: callId, name: 'bash', arguments: {} }],
    stopReason,
  });
}

function writeSession(entries) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pisesh-test-'));
  const file = path.join(dir, 'session.jsonl');
  fs.writeFileSync(file, `${entries.map(value => JSON.stringify(value)).join('\n')}\n`);
  return file;
}

function readSession(file) {
  try {
    return fs.readFileSync(file, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  } catch (error) {
    assert.fail(`invalid session fixture: ${error.message}`);
  }
}

for (const stopReason of ['error', 'aborted']) {
  test(`does not heal an ${stopReason} assistant tool call`, () => {
    const file = writeSession([
      assistant('assistant', stopReason, 'call-bad'),
      entry('user', 'assistant', { role: 'user', content: [{ type: 'text', text: 'continue' }] }),
    ]);

    assert.equal(healOrphanedToolCalls(file), 0);
    assert.deepEqual(readSession(file).map(value => value.message.role), ['assistant', 'user']);
  });
}

test('removes a previously injected result for an errored tool call', () => {
  const interrupted = entry('synthetic', 'assistant', {
    role: 'toolResult',
    toolCallId: 'call-bad',
    toolName: 'bash',
    content: [{ type: 'text', text: '[tool call interrupted: no result was recorded]' }],
    isError: true,
  });
  const file = writeSession([
    assistant('assistant', 'error', 'call-bad'),
    interrupted,
    entry('user', 'synthetic', { role: 'user', content: [{ type: 'text', text: 'continue' }] }),
  ]);

  assert.equal(healOrphanedToolCalls(file), 1);
  const healed = readSession(file);
  assert.deepEqual(healed.map(value => value.id), ['assistant', 'user']);
  assert.equal(healed[1].parentId, 'assistant');
  assert.equal(healOrphanedToolCalls(file), 0);
});

test('still adds a result for a valid unfinished toolUse turn', () => {
  const file = writeSession([
    assistant('assistant', 'toolUse', 'call-good'),
    entry('user', 'assistant', { role: 'user', content: [{ type: 'text', text: 'continue' }] }),
  ]);

  assert.equal(healOrphanedToolCalls(file), 1);
  const healed = readSession(file);
  assert.deepEqual(healed.map(value => value.message.role), ['assistant', 'toolResult', 'user']);
  assert.equal(healed[1].message.toolCallId, 'call-good');
  assert.equal(healed[2].parentId, healed[1].id);
  assert.equal(healOrphanedToolCalls(file), 0);
});
