import FileHandler from "../utils/FileHandler.js";

class ColumnStorage {
  constructor() {
    this.filePath = "./src/database/data.json";
  }

  getAllColumnsWithTasks() {
    try {
      const data = FileHandler.readFile(this.filePath);

      const columnsWithTasks = Object.values(data.columns).map((column) => {
        const tasks = column.tasks.map((taskId) => data.tasks[taskId]);
        return {
          ...column,
          tasks,
        };
      });
      return columnsWithTasks;
    } catch (error) {}
  }

  addColumn(newColumn) {
    const data = FileHandler.readFile(this.filePath);
    data.columns[newColumn.id] = JSON.parse(JSON.stringify(newColumn));

    FileHandler.writeFile(this.filePath, data);
  }

  deleteColumn(id) {
    try {
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
    } catch (error) {
      console.error("컬럼 삭제 중 오류 발생:", error);
      throw new Error("컬럼을 삭제하는 중 오류 발생");
    }
  }
}

export default new ColumnStorage();
