/**
 * Create or reset the default admin user.
 * Run from server directory: node scripts/create-admin.js
 * Or from project root: node server/scripts/create-admin.js
 *
 * REQUIRED: ADMIN_PASSWORD must be set (min 12 chars, mixed case + number).
 * Optional: ADMIN_USERNAME, ADMIN_EMAIL, RESET_ADMIN=1
 */
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validatePasswordStrength } from '../lib/security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || 'admin@viet.edu.in';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD;
const RESET_ADMIN = process.env.RESET_ADMIN === '1' || process.env.RESET_ADMIN === 'true';

async function main() {
  try {
    if (!DEFAULT_PASSWORD) {
      console.error('Set ADMIN_PASSWORD to a strong password before running this script.');
      console.error('Example: ADMIN_PASSWORD="YourStrongPass1" node scripts/create-admin.js');
      process.exit(1);
    }
    const strengthError = validatePasswordStrength(DEFAULT_PASSWORD);
    if (strengthError) {
      console.error(strengthError);
      process.exit(1);
    }

    let data;
    try {
      data = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      data = { users: [] };
    }

    const users = data.users || [];
    const existing = users.find(
      (u) => u.username === DEFAULT_USERNAME || u.email === DEFAULT_EMAIL
    );

    if (existing && RESET_ADMIN) {
      existing.password = await bcrypt.hash(DEFAULT_PASSWORD, 12);
      await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
      console.log('Admin password reset for username:', DEFAULT_USERNAME);
      return;
    }

    if (existing) {
      console.log('Admin user already exists.');
      console.log('  To reset password (JSON only): RESET_ADMIN=1 ADMIN_PASSWORD="..." node scripts/create-admin.js');
      return;
    }

    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    const newUser = {
      id: users.length ? Math.max(...users.map((u) => u.id), 0) + 1 : 1,
      username: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      password: hashed,
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    data.users = data.users || [];
    data.users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));

    console.log('Admin user created.');
    console.log('  Username:', DEFAULT_USERNAME);
    console.log('  Password: (from ADMIN_PASSWORD — not printed)');
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

main();
