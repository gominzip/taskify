import { pool } from "../config/db.js";

class TaskStorage {
  async getTask(id) {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND is_deleted = 0",
      [id]
    );
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
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [tasksRows] = await connection.query(
        "SELECT task_order FROM tasks WHERE column_id = ? AND is_deleted = 0",
        [column_id]
      );
      let highestOrder = 0;
      if (tasksRows.length > 0) {
        highestOrder = Math.max(...tasksRows.map((task) => task.task_order));
      }

      const [result] = await connection.query(
        "INSERT INTO tasks (column_id, title, description, author_id, task_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [column_id, title, description, author_id, highestOrder + 1]
      );

      const newTaskId = result.insertId;

      await connection.commit();
      return this.getTask(newTaskId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /** 테스크 삭제 */
  async deleteTask(id) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [taskRows] = await connection.query(
        "SELECT * FROM tasks WHERE id = ? AND is_deleted = 0",
        [id]
      );
      if (taskRows.length === 0) {
        throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
      }

      const task = taskRows[0];
      const column_id = task.column_id;
      const taskOrder = task.task_order;

      // 테스크를 삭제 상태로 변경
      await connection.query("UPDATE tasks SET is_deleted = 1 WHERE id = ?", [
        id,
      ]);

      // 컬럼 내 우선순위 조정
      // 삭제된 태스크를 제외하고 우선순위를 재조정
      await connection.query(
        "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ? AND is_deleted = 0",
        [column_id, taskOrder]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /** 테스크 업데이트 */
  async updateTask(id, updates) {
    const { column_id, task_order, title, description } = updates;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const currentTask = await this.getTask(id);

      if (!currentTask) {
        throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
      }

      const oldColumnId = currentTask.column_id;
      const oldOrder = currentTask.task_order;

      if (column_id && oldColumnId !== column_id) {
        await this.#updateOrderInOldColumn(connection, oldColumnId, oldOrder);
        await this.#updateOrderInNewColumn(connection, column_id, task_order);
        await this.#updateTask(
          connection,
          id,
          column_id,
          task_order ?? oldOrder,
          title,
          description
        );
      } else {
        if (task_order !== undefined && task_order !== oldOrder) {
          await this.#updateOrderInColumn(
            connection,
            oldColumnId,
            oldOrder,
            task_order
          );
          await this.#updateTask(
            connection,
            id,
            oldColumnId,
            task_order,
            title,
            description
          );
        } else {
          await this.#updateTask(
            connection,
            id,
            oldColumnId,
            oldOrder,
            title,
            description
          );
        }
      }

      await connection.commit();
      return this.getTask(id);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /** 이전 컬럼에서 우선순위 조정 */
  async #updateOrderInOldColumn(connection, column_id, oldOrder) {
    await connection.query(
      "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ? AND is_deleted = 0",
      [column_id, oldOrder]
    );
  }

  /** 새 컬럼에서 우선순위 조정 */
  async #updateOrderInNewColumn(connection, column_id, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    await connection.query(
      "UPDATE tasks SET task_order = task_order + 1 WHERE column_id = ? AND task_order >= ? AND is_deleted = 0",
      [column_id, newOrder]
    );
  }

  /** 컬럼 내부에서 우선순위 조정 */
  async #updateOrderInColumn(connection, column_id, oldOrder, newOrder) {
    if (newOrder === undefined) {
      return;
    }
    if (newOrder > oldOrder) {
      await connection.query(
        "UPDATE tasks SET task_order = task_order - 1 WHERE column_id = ? AND task_order > ? AND task_order <= ? AND is_deleted = 0",
        [column_id, oldOrder, newOrder]
      );
    } else {
      await connection.query(
        "UPDATE tasks SET task_order = task_order + 1 WHERE column_id = ? AND task_order >= ? AND task_order < ? AND is_deleted = 0",
        [column_id, newOrder, oldOrder]
      );
    }
  }

  /** 테스크 업데이트 */
  async #updateTask(
    connection,
    taskId,
    column_id,
    taskOrder,
    title,
    description
  ) {
    await connection.query(
      "UPDATE tasks SET column_id = ?, task_order = ?, title = COALESCE(?, title), description = COALESCE(?, description), updated_at = NOW() WHERE id = ?",
      [column_id, taskOrder, title, description, taskId]
    );
  }
}

export default new TaskStorage();
