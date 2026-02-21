import fs from 'node:fs';
import path from 'node:path';

const files = ['.env', '.env.local', '.env.example'];
const riskyToken = /(SECRET|SERVICE|PASSWORD|PRIVATE|WEBHOOK|ADMIN|ROLE|BEARER)/i;
const maybeSensitiveToken = /(TOKEN|KEY)/i;
const allowList = new Set([
  'VITE_SUPABASE_ANON_KEY',
  'VITE_STRIPE_PUBLIC_KEY',
  'VITE_GA_MEASUREMENT_ID',
]);

const findings = [];

for (const file of files) {
  const fullPath = path.resolve(process.cwd(), file);
  if (!fs.existsSync(fullPath)) continue;

  const lines = fs.readFileSync(fullPath, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const clean = line.trim();
    if (!clean || clean.startsWith('#')) return;
    const match = clean.match(/^([A-Za-z_][A-Za-z0-9_]*)=/);
    if (!match) return;

    const key = match[1];
    if (!key.startsWith('VITE_')) return;
    if (allowList.has(key)) return;

    if (riskyToken.test(key) || maybeSensitiveToken.test(key)) {
      findings.push({
        file,
        line: index + 1,
        key,
      });
    }
  });
}

if (findings.length > 0) {
  console.error('ERRO: variaveis potencialmente sensiveis com prefixo VITE_ detectadas.');
  for (const item of findings) {
    console.error(`- ${item.file}:${item.line} -> ${item.key}`);
  }
  console.error('Remova o prefixo VITE_ ou mova para backend/edge secrets.');
  process.exit(1);
}

console.log('OK: nenhuma exposicao obvia de segredo com prefixo VITE_.');
