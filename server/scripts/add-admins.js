/**
 * Add two admin users: K BHARGAV and PRINCIPAL
 * Run from project root: node server/scripts/add-admins.js
 */
import bcrypt from 'bcryptjs';
import * as db from '../lib/db.js';

const ADMINS = [
  { username: 'K BHARGAV', email: 'website@viet.edu.in', password: 'Cecial@2026' },
  { username: 'PRINCIPAL', email: 'principal@vietvsp.com', password: 'Principal@viet@2026' },
];

async function main() {
  for (const { username, email, password } of ADMINS) {
    try {
      const existing = await db.findUserByUsernameOrEmail(username) || await db.findUserByUsernameOrEmail(email);
      if (existing) {
        console.log(`User "${username}" or ${email} already exists. Skipping.`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Created admin: ${username} (${email})`);
    } catch (err) {
      console.error(`Error creating ${username}:`, err.message);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
