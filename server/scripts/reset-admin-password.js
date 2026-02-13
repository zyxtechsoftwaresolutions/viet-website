/**
 * Reset password for admin user.
 * Run: ADMIN_PASSWORD=ZYX@0141 node server/scripts/reset-admin-password.js
 */
import bcrypt from 'bcryptjs';
import * as db from '../lib/db.js';

const USERNAME = 'admin';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function main() {
  const user = await db.findUserByUsernameOrEmail(USERNAME);
  if (!user) {
    console.error('Admin user not found.');
    process.exit(1);
  }
  const hashed = await bcrypt.hash(NEW_PASSWORD, 10);
  await db.updateUser(user.id, { password: hashed });
  console.log('Admin password updated successfully.');
}

main().catch((e) => { console.error(e); process.exit(1); });
