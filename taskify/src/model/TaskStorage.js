import FileHandler from "../utils/FileHandler.js";

class TaskStorage {
  constructor() {
    this.filePath = "./src/database/data.json";
  }

  getTask(id) {
    try {
      const data = FileHandler.readFile(this.filePath);

      if (!data.tasks[id]) {
        throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
      }

      return data.tasks[id];
    } catch (error) {}
  }

  addTask(newTask) {
    const data = FileHandler.readFile(this.filePath);
    const column = data.columns[newTask.columnId];

    // 기존 테스크 우선순위 수정
    column.tasks.forEach((taskId) => {
      const existingTask = data.tasks[taskId];
      if (existingTask.order >= newTask.order) {
        existingTask.order += 1;
      }
    });

    data.tasks[newTask.id] = JSON.parse(JSON.stringify(newTask));
    column.tasks.push(newTask.id);

    FileHandler.writeFile(this.filePath, data);
  }

  updateTask(id, updates) {
    const data = FileHandler.readFile(this.filePath);
    const task = data.tasks[id];

    if (!task) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const columnId = task.columnId;
    const columnTasks = data.columns[columnId].tasks;

    let oldOrder = task.order;

    if (updates.order !== undefined) {
      const newOrder = Number(updates.order);
      // order 값 검증
      if (isNaN(newOrder) || newOrder < 0 || newOrder >= columnTasks.length) {
        throw new Error(`유효하지 않은 order 값입니다: ${updates.order}`);
      }

      // 컬럼의 모든 테스크의 order 값 업데이트
      const tasksInColumn = columnTasks.map((taskId) => data.tasks[taskId]);

      if (newOrder > oldOrder) {
        tasksInColumn.forEach((t) => {
          if (t.order >= oldOrder + 1 && t.order <= newOrder) {
            t.order -= 1;
          }
        });
      } else if (newOrder < oldOrder) {
        tasksInColumn.forEach((t) => {
          if (t.order >= newOrder && t.order < oldOrder) {
            t.order += 1;
          }
        });
      }

      task.order = newOrder;
      updates.order = newOrder;
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    data.tasks[id] = updatedTask;
    FileHandler.writeFile(this.filePath, data);

    return updatedTask;
  }

  deleteTask(id) {
    const data = FileHandler.readFile(this.filePath);

    if (!data.tasks[id]) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const taskToDelete = data.tasks[id];
    const column = data.columns[taskToDelete.columnId];

    delete data.tasks[id];

    column.tasks = column.tasks.filter((taskId) => taskId !== id);

    column.tasks.forEach((taskId) => {
      const task = data.tasks[taskId];
      if (task.order > taskToDelete.order) {
        task.order -= 1;
      }
    });

    FileHandler.writeFile(this.filePath, data);
  }
}

export default new TaskStorage();
