import { pool } from "../config/db.js";

class TaskStorage {
  async getTask(id) {
    const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (tasks.length === 0) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const task = tasks[0];

    const [users] = await pool.query("SELECT name FROM users WHERE id = ?", [
      task.author_id,
    ]);
    const userName = users.length > 0 ? users[0].name : "Unknown";

    return {
      ...task,
      userName,
    };
  }

  async addTask(newTask) {
    const { column_id, title, description, author_id } = newTask;

    const [tasksRows] = await pool.query(
      "SELECT task_order FROM tasks WHERE column_id = ?",
      [column_id]
    );
    let highestOrder = 0;
    if (tasksRows.length > 0) {
      highestOrder = Math.max(...tasksRows.map((task) => task.task_order));
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (column_id, title, description, author_id, task_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [column_id, title, description, author_id, highestOrder + 1]
    );

    const newTaskId = result.insertId;
    return this.getTask(newTaskId);
  }

  /** 테스크 삭제 */
  async deleteTask(id) {
    const [taskRows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [
      id,
    ]);

    if (taskRows.length === 0) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const task = taskRows[0];
    const column_id = task.column_id;
    const taskOrder = task.task_order;

    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    // 컬럼 내 우선순위 조정
    await pool.query(
      "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ?",
      [column_id, taskOrder]
    );
  }

  /** 테스크 업데이트 */
  async updateTask(id, updates) {
    const { column_id, task_order, title, description } = updates;

    const currentTask = await this.getTask(id);

    if (!currentTask) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const oldColumnId = currentTask.column_id;
    const oldOrder = currentTask.task_order;

    if (column_id && oldColumnId !== column_id) {
      await this.#updateOrderInOldColumn(oldColumnId, oldOrder);
      await this.#updateOrderInNewColumn(column_id, task_order);
      await this.#updateTask(
        id,
        column_id,
        task_order ?? oldOrder,
        title,
        description
      );
    } else {
      if (task_order !== undefined && task_order !== oldOrder) {
        await this.#updateOrderInColumn(oldColumnId, oldOrder, task_order);
        await this.#updateTask(id, oldColumnId, task_order, title, description);
      } else {
        await this.#updateTask(id, oldColumnId, oldOrder, title, description);
      }
    }

    return this.getTask(id);
  }

  /** 이전 컬럼에서 우선순위 조정 */
  async #updateOrderInOldColumn(column_id, oldOrder) {
    await pool.query(
      "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ?",
      [column_id, oldOrder]
    );
  }

  /** 새 컬럼에서 우선순위 조정 */
  async #updateOrderInNewColumn(column_id, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    await pool.query(
      "UPDATE tasks SET task_order = task_order + 1 WHERE column_id = ? AND task_order >= ?",
      [column_id, newOrder]
    );
  }

  /** 컬럼 내부에서 우선순위 조정 */
  async #updateOrderInColumn(column_id, oldOrder, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    if (newOrder > oldOrder) {
      await pool.query(
        "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ? AND task_order <= ?",
        [column_id, oldOrder, newOrder]
      );
    } else {
      await pool.query(
        "UPDATE tasks SET task_order = task_order + 1 WHERE column_id = ? AND task_order >= ? AND task_order < ?",
        [column_id, newOrder, oldOrder]
      );
    }
  }

  /** 테스크 업데이트 */
  async #updateTask(taskId, column_id, taskOrder, title, description) {
    await pool.query(
      "UPDATE tasks SET column_id = ?, task_order = ?, title = COALESCE(?, title), description = COALESCE(?, description), updated_at = NOW() WHERE id = ?",
      [column_id, taskOrder, title, description, taskId]
    );
  }
}

export default new TaskStorage();
