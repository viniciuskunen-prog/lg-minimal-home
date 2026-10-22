// Writes <dir>/<app-id>.manifest.json for the webOS Homebrew Channel repository.
//
//   node scripts/gen-manifest.mjs --repo <owner>/<name> [--dir <package-directory>]
//
// In GitHub Actions the repo comes from GITHUB_REPOSITORY. The manifest is published
// as a release asset next to the .ipk, so `ipkUrl` is relative to it (the same layout
// the Homebrew Channel itself uses).
import {createHash} from 'node:crypto';
import {readFileSync, writeFileSync} from 'node:fs';
import {basename, join} from 'node:path';

const arg = (name) => {
	const i = process.argv.indexOf(`--${name}`);
	return i === -1 ? undefined : process.argv[i + 1];
};

const repo = arg('repo') || process.env.GITHUB_REPOSITORY;
const outputDir = arg('dir') || 'build';
if (!repo) {
	console.error('Missing --repo <owner>/<name> (or GITHUB_REPOSITORY)');
	process.exit(1);
}

const appinfo = JSON.parse(readFileSync('public/appinfo.json', 'utf8'));
const expected = `${appinfo.id}_${appinfo.version}_all.ipk`;
const ipkPath = join(outputDir, expected);
let ipkBytes;
try { ipkBytes = readFileSync(ipkPath); }
catch {
	console.error(`Expected ${ipkPath} — run npm run package with LG_PACKAGE_OUTPUT=${outputDir}`);
	process.exit(1);
}
const manifest = {
	id: appinfo.id,
	version: appinfo.version,
	type: appinfo.type,
	title: appinfo.title,
	appDescription: appinfo.appDescription,
	iconUri: `https://raw.githubusercontent.com/${repo}/main/public/largeIcon.png`,
	sourceUrl: `https://github.com/${repo}`,
	rootRequired: false,
	ipkUrl: basename(ipkPath),
	ipkHash: {sha256: createHash('sha256').update(ipkBytes).digest('hex')}
};

const out = join(outputDir, `${appinfo.id}.manifest.json`);
writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${out}`);
