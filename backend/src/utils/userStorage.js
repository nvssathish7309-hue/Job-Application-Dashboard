const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'persistent_users.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const getPersistentUsers = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(USERS_FILE)) {
      return [];
    }
    const content = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.warn('Error reading persistent users file:', err.message);
    return [];
  }
};

const saveUserToPersistentStore = (userObj, rawPassword = '') => {
  try {
    ensureDataDir();
    const users = getPersistentUsers();
    const cleanEmail = (userObj.email || '').toLowerCase().trim();
    if (!cleanEmail) return;

    const existingIdx = users.findIndex(u => (u.email || '').toLowerCase().trim() === cleanEmail);

    const record = {
      _id: userObj._id ? userObj._id.toString() : undefined,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      email: cleanEmail,
      role: userObj.role,
      department: userObj.department || 'Human Resources',
      phone: userObj.phone || '',
      isActive: userObj.isActive !== undefined ? userObj.isActive : true,
      rawPassword: rawPassword || userObj.rawPassword || '',
      passwordHash: userObj.password || userObj.passwordHash || '',
      createdAt: userObj.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      if (!rawPassword && users[existingIdx].rawPassword) {
        record.rawPassword = users[existingIdx].rawPassword;
      }
      if (!record.passwordHash && users[existingIdx].passwordHash) {
        record.passwordHash = users[existingIdx].passwordHash;
      }
      users[existingIdx] = { ...users[existingIdx], ...record };
    } else {
      users.push(record);
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    console.log(`Saved persistent user account: ${cleanEmail}`);
  } catch (err) {
    console.warn('Error saving persistent user:', err.message);
  }
};

const removeUserFromPersistentStore = (identifier) => {
  try {
    ensureDataDir();
    const users = getPersistentUsers();
    const target = (identifier || '').toString().toLowerCase().trim();

    const filtered = users.filter(u => {
      const uId = (u._id || '').toString().toLowerCase();
      const uEmail = (u.email || '').toLowerCase().trim();
      return uId !== target && uEmail !== target;
    });

    fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
    console.log(`Removed user from persistent store: ${target}`);
  } catch (err) {
    console.warn('Error removing persistent user:', err.message);
  }
};

const syncPersistentUsersToDB = async () => {
  try {
    const persistentUsers = getPersistentUsers();
    if (!persistentUsers.length) return;

    for (const pUser of persistentUsers) {
      if (!pUser.email) continue;
      const cleanEmail = pUser.email.toLowerCase().trim();
      const dbUser = await User.findOne({ email: cleanEmail });

      if (!dbUser) {
        console.log(`Restoring persistent user into MongoDB: ${cleanEmail} (${pUser.role})`);
        const passwordToUse = pUser.rawPassword || pUser.passwordHash || 'TeamAccess@2026';
        await User.create({
          firstName: pUser.firstName || 'Team',
          lastName: pUser.lastName || 'Member',
          email: cleanEmail,
          password: passwordToUse,
          role: pUser.role || 'RECRUITER',
          department: pUser.department || 'Human Resources',
          phone: pUser.phone || '',
          isActive: pUser.isActive !== undefined ? pUser.isActive : true
        });
      } else {
        let modified = false;
        if (pUser.role && dbUser.role !== pUser.role) {
          dbUser.role = pUser.role;
          modified = true;
        }
        if (pUser.department && dbUser.department !== pUser.department) {
          dbUser.department = pUser.department;
          modified = true;
        }
        if (pUser.phone && dbUser.phone !== pUser.phone) {
          dbUser.phone = pUser.phone;
          modified = true;
        }
        if (pUser.isActive !== undefined && dbUser.isActive !== pUser.isActive) {
          dbUser.isActive = pUser.isActive;
          modified = true;
        }
        if (modified) {
          await dbUser.save();
        }
      }
    }
  } catch (err) {
    console.warn('Error syncing persistent users to MongoDB:', err.message);
  }
};

module.exports = {
  getPersistentUsers,
  saveUserToPersistentStore,
  removeUserFromPersistentStore,
  syncPersistentUsersToDB
};
