/**
 * Hash a password for manual DB updates.
 * Usage: node scripts/hash-password.js "YourStrongPass1"
 *    or: ADMIN_PASSWORD="YourStrongPass1" node scripts/hash-password.js
 */
import bcrypt from 'bcryptjs';

const plain = process.argv[2] || process.env.ADMIN_PASSWORD;
if (!plain) {
  console.error('Provide a password as argv or ADMIN_PASSWORD env var.');
  process.exit(1);
}

const hash = bcrypt.hashSync(plain, 12);
console.log('Hash:', hash);
console.log('Valid:', bcrypt.compareSync(plain, hash));
