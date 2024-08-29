import { pool } from "../config/db.js";

class TaskStorage {
  async getTask(id) {
    const [tasks] = await pool.query("SELECT * FROM tasks WHERE id = ?", [id]);
    if (tasks.length === 0) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const task = tasks[0];

    const [users] = await pool.query("SELECT name FROM users WHERE id = ?", [
      task.authorId,
    ]);
    const userName = users.length > 0 ? users[0].name : "Unknown";

    return {
      ...task,
      userName,
    };
  }

  async addTask(newTask) {
    const { columnId, title, description, authorId } = newTask;

    const [tasksRows] = await pool.query(
      "SELECT task_order FROM tasks WHERE columnId = ?",
      [columnId]
    );
    let highestOrder = 0;
    if (tasksRows.length > 0) {
      highestOrder = Math.max(...tasksRows.map((task) => task.task_order));
    }

    const [result] = await pool.query(
      "INSERT INTO tasks (columnId, title, description, authorId, task_order, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      [columnId, title, description, authorId, highestOrder + 1]
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
    const columnId = task.columnId;
    const taskOrder = task.task_order;

    await pool.query("DELETE FROM tasks WHERE id = ?", [id]);

    // 컬럼 내 우선순위 조정
    await pool.query(
      "UPDATE tasks SET task_order = task_order - 1 WHERE columnId = ? AND task_order > ?",
      [columnId, taskOrder]
    );
  }

  /** 테스크 업데이트 */
  async updateTask(id, updates) {
    const { columnId, task_order, title, description } = updates;

    const currentTask = await this.getTask(id);

    if (!currentTask) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const oldColumnId = currentTask.columnId;
    const oldOrder = currentTask.task_order;

    if (columnId && oldColumnId !== columnId) {
      await this.#updateOrderInOldColumn(oldColumnId, oldOrder);
      await this.#updateOrderInNewColumn(columnId, task_order);
      await this.#updateTask(
        id,
        columnId,
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
  async #updateOrderInOldColumn(columnId, oldOrder) {
    await pool.query(
      "UPDATE tasks SET task_order = task_order - 1 WHERE columnId = ? AND task_order > ?",
      [columnId, oldOrder]
    );
  }

  /** 새 컬럼에서 우선순위 조정 */
  async #updateOrderInNewColumn(columnId, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    await pool.query(
      "UPDATE tasks SET task_order = task_order + 1 WHERE columnId = ? AND task_order >= ?",
      [columnId, newOrder]
    );
  }

  /** 컬럼 내부에서 우선순위 조정 */
  async #updateOrderInColumn(columnId, oldOrder, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    if (newOrder > oldOrder) {
      await pool.query(
        "UPDATE tasks SET task_order = task_order - 1 WHERE columnId = ? AND task_order > ? AND task_order <= ?",
        [columnId, oldOrder, newOrder]
      );
    } else {
      await pool.query(
        "UPDATE tasks SET task_order = task_order + 1 WHERE columnId = ? AND task_order >= ? AND task_order < ?",
        [columnId, newOrder, oldOrder]
      );
    }
  }

  /** 테스크 업데이트 */
  async #updateTask(taskId, columnId, taskOrder, title, description) {
    await pool.query(
      "UPDATE tasks SET columnId = ?, task_order = ?, title = COALESCE(?, title), description = COALESCE(?, description), updatedAt = NOW() WHERE id = ?",
      [columnId, taskOrder, title, description, taskId]
    );
  }
}

export default new TaskStorage();
