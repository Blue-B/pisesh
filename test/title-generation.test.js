'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  parseModelEntries,
  parseModelList,
  buildTitlePrompt,
  cleanGeneratedTitle,
  takeGenerationBatch,
} = require('../bin/pisesh');

test('parses canonical model ids from pi --list-models', () => {
  const output = [
    'provider      model          context  max-out  thinking  images',
    'openai        gpt-4o-mini    128K     16K      no        yes',
    'anthropic     claude-haiku   200K     8K       yes       yes',
    '',
  ].join('\n');
  assert.deepEqual(parseModelList(output), [
    'openai/gpt-4o-mini',
    'anthropic/claude-haiku',
  ]);
  assert.deepEqual(parseModelEntries(output), [
    { id: 'openai/gpt-4o-mini', thinking: false },
    { id: 'anthropic/claude-haiku', thinking: true },
  ]);
});

test('takes at most three concurrent generation jobs', () => {
  const queue = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(takeGenerationBatch(queue, 0), ['a', 'b', 'c']);
  assert.deepEqual(queue, ['d', 'e']);
  assert.deepEqual(takeGenerationBatch(queue, 3), []);
  assert.deepEqual(queue, ['d', 'e']);
  assert.deepEqual(takeGenerationBatch(queue, 2), ['d']);
  assert.deepEqual(queue, ['e']);
});

test('cleans generated title and subtitle output', () => {
  assert.equal(
    cleanGeneratedTitle('Title: “Improve Title Generation: Add a complementary summary without repeating the main task.”\n'),
    'Improve Title Generation: Add a complementary summary without repeating the main task.',
  );
  assert.equal(
    cleanGeneratedTitle("  'Fix CJK Layout: Correct display widths in the session list.'  "),
    'Fix CJK Layout: Correct display widths in the session list.',
  );
  assert.throws(() => cleanGeneratedTitle('\n\n'), /empty title/);
});

test('builds role-aware title context and excludes plans and tool results', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pisesh-title-'));
  const file = path.join(dir, 'session.jsonl');
  const entries = [
    { type: 'session', id: 'abc', cwd: '/work/sample-project' },
    { type: 'message', message: { role: 'user', content: [{ type: 'text', text: 'Refactor retry handling' }] } },
    { type: 'message', message: { role: 'assistant', content: [{ type: 'text', text: 'I will inspect the implementation.' }, { type: 'toolCall', name: 'read' }] } },
    { type: 'message', message: { role: 'toolResult', content: [{ type: 'text', text: 'SECRET TOOL OUTPUT' }] } },
    { type: 'message', message: { role: 'assistant', content: [{ type: 'text', text: 'Extracted a shared retry policy.' }], stopReason: 'stop' } },
    { type: 'message', message: { role: 'user', content: [{ type: 'text', text: 'Keep the public API unchanged' }] } },
    { type: 'message', message: { role: 'assistant', content: [{ type: 'text', text: 'PARTIAL ABORTED RESPONSE' }], stopReason: 'aborted' } },
  ];
  fs.writeFileSync(file, entries.map(x => JSON.stringify(x)).join('\n'));
  const prompt = buildTitlePrompt(file, 1000);
  assert.match(prompt, /Working directory: sample-project/);
  assert.match(prompt, /User request 1: Refactor retry handling/);
  assert.match(prompt, /User request 2: Keep the public API unchanged/);
  assert.match(prompt, /Assistant evidence 1: Extracted a shared retry policy/);
  assert.doesNotMatch(prompt, /I will inspect the implementation/);
  assert.doesNotMatch(prompt, /SECRET TOOL OUTPUT/);
  assert.doesNotMatch(prompt, /PARTIAL ABORTED RESPONSE/);
  assert.match(prompt, /Output exactly one line:\n<3-8 word title>: <6-14 word subtitle>/);
});
