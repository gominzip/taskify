import { pool } from "../config/db.js";

class HistoryStorage {
  async getHistories() {
    const [rows] = await pool.query(
      "SELECT * FROM histories ORDER BY created_at DESC"
    );
    return rows;
  }

  async addHistories(action, beforeState, afterState, userId) {
    const [result] = await pool.query(
      "INSERT INTO histories (action, created_at, before_state, after_state, user_id) VALUES (?, NOW(), ?, ?, ?)",
      [action, JSON.stringify(beforeState), JSON.stringify(afterState), userId]
    );
    return result.insertId;
  }

  async resetHistories() {
    await pool.query("TRUNCATE TABLE histories");
  }
}

export default new HistoryStorage();
