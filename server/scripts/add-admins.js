/**
 * Add admin users from environment variables (no passwords in source).
 *
 * From project root:
 *   ADMIN_USERNAME_1="K BHARGAV" ADMIN_EMAIL_1="website@viet.edu.in" ADMIN_PASSWORD_1="..." \
 *   ADMIN_USERNAME_2="PRINCIPAL" ADMIN_EMAIL_2="principal@vietvsp.com" ADMIN_PASSWORD_2="..." \
 *   node server/scripts/add-admins.js
 */
import bcrypt from 'bcryptjs';
import * as db from '../lib/db.js';
import { validatePasswordStrength } from '../lib/security.js';

function readAdmin(index) {
  const username = process.env[`ADMIN_USERNAME_${index}`];
  const email = process.env[`ADMIN_EMAIL_${index}`];
  const password = process.env[`ADMIN_PASSWORD_${index}`];
  if (!username && !email && !password) return null;
  if (!username || !email || !password) {
    throw new Error(
      `ADMIN_USERNAME_${index}, ADMIN_EMAIL_${index}, and ADMIN_PASSWORD_${index} are all required together`
    );
  }
  const strengthError = validatePasswordStrength(password);
  if (strengthError) {
    throw new Error(`ADMIN_PASSWORD_${index}: ${strengthError}`);
  }
  return { username, email, password };
}

async function main() {
  const admins = [readAdmin(1), readAdmin(2)].filter(Boolean);
  if (admins.length === 0) {
    console.error(
      'No admins specified. Set ADMIN_USERNAME_1, ADMIN_EMAIL_1, ADMIN_PASSWORD_1 (and optionally _2).'
    );
    process.exit(1);
  }

  for (const { username, email, password } of admins) {
    try {
      const existing =
        (await db.findUserByUsernameOrEmail(username)) ||
        (await db.findUserByUsernameOrEmail(email));
      if (existing) {
        console.log(`User "${username}" or ${email} already exists. Skipping.`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await db.createUser({
        username,
        email,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`Created admin: ${username} (${email})`);
    } catch (err) {
      console.error(`Error creating ${username}:`, err.message);
      process.exitCode = 1;
    }
  }
}

main()
  .then(() => process.exit(process.exitCode || 0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
