// Rewrites README.md *in place* for the npm tarball only (run in CI before
// `npm publish`). The committed GitHub README.md stays bilingual with relative
// asset paths; this produces the version pi.dev / npmjs.com render:
//   1. drops the "English | 한국어" toggle line (the link only points back to
//      GitHub and has no meaning on npm/pi.dev)
//   2. absolutizes relative assets/ image paths to raw.githubusercontent URLs,
//      because assets/ is not shipped in the tarball (see package.json "files")
//
// Idempotent. Never commit the result — CI checkout is ephemeral.
import fs from 'node:fs';

const RAW = 'https://raw.githubusercontent.com/Blue-B/pisesh/main/';
const file = 'README.md';
let t = fs.readFileSync(file, 'utf8');

// 1. remove the language-toggle line (+ trailing blank line)
t = t.replace(/^\*\*English\*\*\s*\|\s*\[한국어\]\([^)]*\)\n\n?/m, '');

// 2. absolutize relative asset references (HTML src + markdown links)
t = t.replace(/src="assets\//g, `src="${RAW}assets/`)
     .replace(/\]\(assets\//g, `](${RAW}assets/`);

fs.writeFileSync(file, t);
console.log('prepare-npm-readme: stripped lang toggle + absolutized asset URLs');
