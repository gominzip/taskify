import FileHandler from "../utils/FileHandler.js";

class TaskStorage {
  constructor() {
    this.filePath = "./src/database/data.json";
  }

  #getData() {
    return FileHandler.readFile(this.filePath);
  }

  #writeData(data) {
    FileHandler.writeFile(this.filePath, data);
  }

  #updateTaskOrders(columnTasks, oldOrder, newOrder, data) {
    columnTasks.forEach((taskId) => {
      const task = data.tasks[taskId];
      if (oldOrder === -1) {
        // 새로 추가된 경우
        task.task_order += 1;
      } else if (newOrder > oldOrder) {
        if (task.task_order >= oldOrder + 1 && task.task_order <= newOrder) {
          task.task_order -= 1;
        }
      } else if (newOrder < oldOrder) {
        if (task.task_order >= newOrder && task.task_order < oldOrder) {
          task.task_order += 1;
        }
      }
    });
  }

  getTask(id) {
    const data = this.#getData();

    if (!data.tasks[id]) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    return data.tasks[id];
  }

  addTask(newTask) {
    const data = this.#getData();
    const column = data.columns[newTask.columnId];

    data.tasks[newTask.id] = { ...newTask };
    this.#updateTaskOrders(column.tasks, -1, newTask.task_order, data);
    column.tasks.push(newTask.id);

    this.#writeData(data);
  }

  /**
   * Task의 변경사항을 Mock 데이터에 반영하는 메서드 입니다...
   * 로직은 제대로 동작하는데 가독성이랑 중복되는 코드들이 있어서 개선 예정입니다
   */
  updateTask(id, updates) {
    const data = this.#getData();
    const task = data.tasks[id];

    if (!task) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    // 컬럼 변경 시
    if (updates.columnId && updates.columnId !== task.columnId) {
      const newColumnId = updates.columnId;

      // 새로운 컬럼이 존재하는지 확인
      if (!data.columns[newColumnId]) {
        throw new Error(`ID가 '${newColumnId}'인 컬럼을 찾을 수 없습니다.`);
      }

      const oldColumn = data.columns[task.columnId];
      const newColumn = data.columns[newColumnId];
      const oldOrder = task.task_order;

      task.columnId = newColumnId;
      task.task_order = updates.task_order ?? newColumn.tasks.length; // 새로운 컬럼에서의 순서

      // 이전 컬럼에서 테스크 제거
      oldColumn.tasks = oldColumn.tasks.filter((taskId) => taskId !== id);

      // 기존 컬럼의 테스크 순서를 업데이트
      this.#updateTaskOrders(
        oldColumn.tasks,
        oldOrder,
        oldColumn.tasks.length,
        data
      );

      // 새로운 칼럼 업데이트
      // 우선 현재 task를 0번째에 추가함 -> 기존 task들의 우선순위 +1됨
      this.#updateTaskOrders(newColumn.tasks, -1, 0, data);
      // tasks에 현재 task를 추가하고
      newColumn.tasks.push(id);
      // 0번째에서 입력된 위치로 order를 변경해줌
      this.#updateTaskOrders(newColumn.tasks, 0, task.task_order, data);

      const { columnId, ...restUpdates } = updates; // 나머지 업데이트 사항 적용
      updates = restUpdates;
    }

    const columnId = task.columnId;
    const columnTasks = data.columns[columnId].tasks;

    let oldOrder = task.task_order;

    if (updates.task_order !== undefined) {
      const newOrder = Number(updates.task_order);
      // order 값 검증
      if (isNaN(newOrder) || newOrder < 0 || newOrder >= columnTasks.length) {
        throw new Error(`유효하지 않은 order 값입니다: ${updates.task_order}`);
      }

      this.#updateTaskOrders(columnTasks, oldOrder, newOrder, data);

      task.task_order = newOrder;
      updates.task_order = newOrder;
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    data.tasks[id] = updatedTask;
    this.#writeData(data);

    return updatedTask;
  }

  deleteTask(id) {
    const data = this.#getData();

    if (!data.tasks[id]) {
      throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
    }

    const taskToDelete = data.tasks[id];
    const column = data.columns[taskToDelete.columnId];

    delete data.tasks[id];

    column.tasks = column.tasks.filter((taskId) => taskId !== id);

    this.#updateTaskOrders(
      column.tasks,
      taskToDelete.task_order,
      column.tasks.length,
      data
    );

    this.#writeData(data);
  }
}

export default new TaskStorage();
