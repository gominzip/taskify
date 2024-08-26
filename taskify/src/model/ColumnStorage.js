import { pool } from "../config/db.js";
import FileHandler from "../utils/FileHandler.js";

class ColumnStorage {
  constructor() {
    this.filePath = "./src/database/data.json";
  }

  async getAllColumnsWithTasks() {
    const [rows] = await pool.query("SELECT * FROM columns");

    const columnsWithTasks = await Promise.all(
      rows.map(async (column) => {
        const [tasks] = await pool.query(
          "SELECT * FROM tasks WHERE columnId = ?",
          [column.id]
        );
        return {
          ...column,
          tasks,
        };
      })
    );

    return columnsWithTasks;
  }

  async addColumn(title) {
    const [result] = await pool.query(
      "INSERT INTO columns (title) VALUES (?)",
      [title]
    );

    const [newColumn] = await pool.query("SELECT * FROM columns WHERE id = ?", [
      result.insertId,
    ]);
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

  deleteColumn(id) {
    const data = FileHandler.readFile(this.filePath);

    if (!data.columns[id]) {
      throw new Error(`ID가 '${id}'인 컬럼을 찾을 수 없습니다.`);
    }

    // 속한 테스크 삭제
    data.columns[id].tasks.forEach((taskId) => {
      delete data.tasks[taskId];
    });

    delete data.columns[id];

    FileHandler.writeFile(this.filePath, data);
  }
}

export default new ColumnStorage();
