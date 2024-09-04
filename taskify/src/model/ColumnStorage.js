import { pool } from "../config/db.js";
import taskStorage from "../model/TaskStorage.js";

class ColumnStorage {
  async getAllColumnsWithTasks() {
    const [columns] = await pool.query(
      "SELECT * FROM columns WHERE is_deleted = 0"
    );

    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        const columnWithTasks = await this.getColumn(column.id);
        return columnWithTasks;
      })
    );
    return columnsWithTasks;
  }

  async getColumn(id) {
    const [rows] = await pool.query(
      "SELECT * FROM columns WHERE id = ? AND is_deleted = 0",
      [id]
    );
    if (rows.length === 0) {
      throw new Error(`ID가 '${id}'인 컬럼을 찾을 수 없습니다.`);
    }

    const column = rows[0];

    const [tasksRows] = await pool.query(
      "SELECT * FROM tasks WHERE column_id = ? AND is_deleted = 0 ORDER BY task_order ASC",
      [id]
    );

    const tasksWithUserNames = await Promise.all(
      tasksRows.map(async (task) => {
        const taskWithUserName = await taskStorage.getTask(task.id);
        return taskWithUserName;
      })
    );

    return {
      ...column,
      tasks: tasksWithUserNames,
    };
  }

  async addColumn(title) {
    const [result] = await pool.query(
      "INSERT INTO columns (title, is_deleted) VALUES (?, 0)",
      [title]
    );

    const [newColumn] = await pool.query("SELECT * FROM columns WHERE id = ?", [
      result.insertId,
    ]);
    newColumn[0].tasks = [];
    return newColumn[0];
  }

  async updateColumn(id, title) {
    const [result] = await pool.query(
      "UPDATE columns SET title = ? WHERE id = ? AND is_deleted = 0",
      [title, id]
    );

    if (result.affectedRows === 0) {
      throw new Error(`ID가 ${id}인 컬럼을 찾을 수 없습니다.`);
    }

    const [updatedColumn] = await pool.query(
      "SELECT * FROM columns WHERE id = ? AND is_deleted = 0",
      [id]
    );
    return updatedColumn[0];
  }

  async deleteColumn(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [tasksRows] = await connection.query(
        "SELECT id FROM tasks WHERE column_id = ? AND is_deleted = 0",
        [id]
      );

      await connection.query("UPDATE columns SET is_deleted = 1 WHERE id = ?", [
        id,
      ]);

      if (tasksRows.length > 0) {
        const taskIds = tasksRows.map((task) => task.id);
        await connection.query(
          "UPDATE tasks SET is_deleted = 1 WHERE id IN (?)",
          [taskIds]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default new ColumnStorage();
