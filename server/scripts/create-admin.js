/**
 * Create or reset the default admin user.
 * Run from server directory: node scripts/create-admin.js
 * Or from project root: node server/scripts/create-admin.js
 *
 * Uses the same DB as the server (JSON file or Supabase).
 * Default: username admin, password admin123
 * Override: ADMIN_PASSWORD=yourpass node scripts/create-admin.js
 * Reset existing admin password (JSON only): RESET_ADMIN=1 node scripts/create-admin.js
 */
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const DEFAULT_USERNAME = 'admin';
const DEFAULT_EMAIL = 'admin@viet.edu.in';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const RESET_ADMIN = process.env.RESET_ADMIN === '1' || process.env.RESET_ADMIN === 'true';

async function main() {
  try {
    // When using JSON files we can create or reset admin directly
    let data;
    try {
      data = JSON.parse(await fs.readFile(USERS_FILE, 'utf-8'));
    } catch (e) {
      if (e.code !== 'ENOENT') throw e;
      data = { users: [] };
    }

    const users = data.users || [];
    const existing = users.find(u => u.username === DEFAULT_USERNAME || u.email === DEFAULT_EMAIL);

    if (existing && RESET_ADMIN) {
      existing.password = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
      console.log('Admin password reset. Username: admin, Password:', DEFAULT_PASSWORD === 'admin123' ? 'admin123' : '(ADMIN_PASSWORD)');
      return;
    }

    if (existing) {
      console.log('Admin user already exists.');
      console.log('  To reset password (JSON only): RESET_ADMIN=1 node scripts/create-admin.js');
      return;
    }

    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const newUser = {
      id: users.length ? Math.max(...users.map(u => u.id), 0) + 1 : 1,
      username: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      password: hashed,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    data.users = data.users || [];
    data.users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));

    console.log('Admin user created.');
    console.log('  Username:', DEFAULT_USERNAME);
    console.log('  Password:', DEFAULT_PASSWORD === 'admin123' ? 'admin123' : '(ADMIN_PASSWORD)');
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
}

main();
