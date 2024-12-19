const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

class PasswordEncoder {
  static async hashPassword(password) {
    try {
      return await bcrypt.hash(password, SALT_ROUNDS);
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }

  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw error;
    }
  }
}

module.exports = PasswordEncoder;
