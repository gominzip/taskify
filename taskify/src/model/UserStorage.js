import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";

class UserStorage {
  async findUserById(userId) {
    const [rows] = await pool.query(
      "SELECT id, username, name, profile_image FROM users WHERE id = ?",
      [userId]
    );
    return rows[0];
  }

  async findUserByUsername(username) {
    const [rows] = await pool.query(
      "SELECT id, username, name, password, profile_image FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  }

  async addUser(username, plainPassword, name, profileImageUrl = null) {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const [result] = await pool.query(
      "INSERT INTO users (username, password, name, profile_image) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, name, profileImageUrl]
    );
    return result.insertId;
  }
}

export default new UserStorage();
