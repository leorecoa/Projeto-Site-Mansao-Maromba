import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ignorePathFragments = [
  'package-lock.json',
  'playwright-report/',
  'test-results/',
  'dist/',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
];

const rules = [
  { name: 'Private key block', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'Supabase service role key var', regex: /\bSUPABASE_SERVICE_ROLE_KEY\s*=/i },
  { name: 'AWS secret access key var', regex: /\bAWS_SECRET_ACCESS_KEY\s*=/i },
  { name: 'GitHub personal access token', regex: /\bghp_[A-Za-z0-9]{36}\b/ },
  { name: 'GitHub fine-grained token', regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: 'Slack token', regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: 'Stripe live secret key', regex: /\bsk_live_[A-Za-z0-9]{16,}\b/ },
  { name: 'Google API key', regex: /\bAIza[0-9A-Za-z\-_]{35}\b/ },
  { name: 'SendGrid API key', regex: /\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b/ },
  { name: 'Resend API key', regex: /\bre_[A-Za-z0-9]{20,}\b/ },
  { name: 'Bearer token literal', regex: /\bBearer\s+[A-Za-z0-9\-_.]{20,}\b/i },
];

const likelyPlaceholder = (line) =>
  /your[_-]|example|placeholder|changeme|dummy|fake|test|<[^>]+>/i.test(line);

const output = execSync('git ls-files -z', { encoding: 'utf8' });
const files = output.split('\0').filter(Boolean);

const findings = [];

for (const file of files) {
  if (ignorePathFragments.some((frag) => file.includes(frag))) continue;

  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;

  const stat = fs.statSync(fullPath);
  if (!stat.isFile()) continue;

  let content;
  try {
    content = fs.readFileSync(fullPath, 'utf8');
  } catch {
    continue;
  }

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of rules) {
      if (!rule.regex.test(line)) continue;
      if (likelyPlaceholder(line)) continue;
      findings.push({
        file,
        line: index + 1,
        rule: rule.name,
        preview: line.trim().slice(0, 140),
      });
    }
  });
}

if (findings.length > 0) {
  console.error('ERRO: possiveis segredos detectados em arquivos versionados.');
  for (const f of findings) {
    console.error(`- ${f.file}:${f.line} [${f.rule}] ${f.preview}`);
  }
  process.exit(1);
}

console.log('OK: nenhum segredo aparente detectado em arquivos versionados.');
