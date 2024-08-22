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

  deleteTask(id) {
    try {
      const data = FileHandler.readFile(this.filePath);

      if (!data.tasks[id]) {
        throw new Error(`ID가 '${id}'인 테스크를 찾을 수 없습니다.`);
      }

      delete data.tasks[id];

      FileHandler.writeFile(this.filePath, data);
    } catch (error) {
      throw new Error("컬럼을 삭제하는 중 오류 발생");
    }
  }
}

export default new TaskStorage();
