/**
 * Diagnose admin login against the same DB as the API.
 * Run from backend/: node scripts/verify-login.js vietstaff
 * Optional password: ADMIN_PASSWORD=Admin@2026 node scripts/verify-login.js vietstaff
 */
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env') });

import * as db from '../src/models/db.js';

const username = process.argv[2] || process.env.USERNAME || 'vietstaff';
const password = process.env.ADMIN_PASSWORD || 'Admin@2026';

async function main() {
  const users = await db.getUsers();
  console.log('Users in DB:', users.length);
  const user = await db.findUserByUsernameOrEmail(username);
  if (!user) {
    console.error('User not found for:', username);
    process.exit(1);
  }
  const hash = user.password ?? user.password_hash;
  console.log('Found:', user.username, '| role:', user.role);
  console.log('Password length:', hash?.length ?? 0);
  console.log('Password starts with:', hash ? String(hash).slice(0, 7) : '(empty)');
  if (!hash || typeof hash !== 'string') {
    console.error('Password column is missing or not a string (API will reject login).');
    process.exit(1);
  }
  if (!hash.startsWith('$2')) {
    console.error('Password is not bcrypt (likely plain text or shell-corrupted hash).');
    process.exit(1);
  }
  const ok = await bcrypt.compare(String(password), hash);
  console.log('bcrypt.compare:', ok ? 'PASS' : 'FAIL');
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
