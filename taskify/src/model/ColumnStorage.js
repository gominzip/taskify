import { pool } from "../config/db.js";
import taskStorage from "../model/TaskStorage.js";

class ColumnStorage {
  async getAllColumnsWithTasks() {
    const [columns] = await pool.query("SELECT * FROM columns");

    const columnsWithTasks = await Promise.all(
      columns.map(async (column) => {
        const columnWithTasks = await this.getColumn(column.id);
        return columnWithTasks;
      })
    );
    return columnsWithTasks;
  }

  async getColumn(id) {
    const [rows] = await pool.query("SELECT * FROM columns WHERE id = ?", [id]);
    if (rows.length === 0) {
      throw new Error(`ID가 '${id}'인 컬럼을 찾을 수 없습니다.`);
    }

    const column = rows[0];

    const [tasksRows] = await pool.query(
      "SELECT * FROM tasks WHERE columnId = ? ORDER BY task_order ASC",
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
      "INSERT INTO columns (title) VALUES (?)",
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
      "UPDATE columns SET title = ? WHERE id = ?",
      [title, id]
    );

    if (result.affectedRows === 0) {
      throw new Error(`ID가 ${id}인 컬럼을 찾을 수 없습니다.`);
    }

    const [updatedColumn] = await pool.query(
      "SELECT * FROM columns WHERE id = ?",
      [id]
    );
    return updatedColumn[0];
  }

  async deleteColumn(id) {
    const [tasksRows] = await pool.query(
      "SELECT id FROM tasks WHERE columnId = ?",
      [id]
    );

    const [columnRows] = await pool.query(
      "SELECT id FROM columns WHERE id = ?",
      [id]
    );

    if (columnRows.length === 0) {
      throw new Error(`ID가 '${id}'인 컬럼을 찾을 수 없습니다.`);
    }

    const taskIds = tasksRows.map((task) => task.id);
    if (taskIds.length > 0) {
      await pool.query("DELETE FROM tasks WHERE id IN (?)", [taskIds]);
    }

    await pool.query("DELETE FROM columns WHERE id = ?", [id]);
  }
}

export default new ColumnStorage();
