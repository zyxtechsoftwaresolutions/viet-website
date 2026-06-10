import bcrypt from 'bcryptjs';

const plain = 'Admin@2026';
const hash = bcrypt.hashSync(plain, 10);

console.log('Plain:', plain);
console.log('Hash:', hash);

// verify
console.log('Valid:', bcrypt.compareSync(plain, hash));