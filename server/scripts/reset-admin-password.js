/**
 * Reset password for an admin user.
 * Run: ADMIN_PASSWORD="YourStrongPass1" node server/scripts/reset-admin-password.js
 * Optional: ADMIN_USERNAME=admin
 */
import bcrypt from 'bcryptjs';
import * as db from '../lib/db.js';
import { validatePasswordStrength } from '../lib/security.js';

const USERNAME = process.env.ADMIN_USERNAME || 'admin';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD;

async function main() {
  if (!NEW_PASSWORD) {
    console.error('Set ADMIN_PASSWORD (required). Example:');
    console.error('  ADMIN_PASSWORD="YourStrongPass1" node server/scripts/reset-admin-password.js');
    process.exit(1);
  }
  const strengthError = validatePasswordStrength(NEW_PASSWORD);
  if (strengthError) {
    console.error(strengthError);
    process.exit(1);
  }

  const user = await db.findUserByUsernameOrEmail(USERNAME);
  if (!user) {
    console.error('Admin user not found:', USERNAME);
    process.exit(1);
  }
  const hashed = await bcrypt.hash(NEW_PASSWORD, 12);
  await db.updateUser(user.id, { password: hashed });
  console.log('Admin password updated successfully for:', USERNAME);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
