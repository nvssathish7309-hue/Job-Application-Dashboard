const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function updateAdminPassword() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const newPassword = 'Sathish@29';
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);

  const result = await mongoose.connection.collection('users').updateOne(
    { email: 'admin@company.com' },
    { $set: { password: hashed } }
  );

  if (result.modifiedCount === 1) {
    console.log('✅ Admin password updated to Sathish@29 successfully!');
  } else {
    console.log('⚠️  No user found with admin@company.com');
  }

  await mongoose.disconnect();
  process.exit(0);
}

updateAdminPassword().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
