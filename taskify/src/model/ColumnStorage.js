import FileHandler from "../utils/FileHandler.js";

class ColumnStorage {
  constructor() {
    this.filePath = "./src/database/data.json";
  }

  async getAllColumnsWithTasks() {
    try {
      const data = await FileHandler.readFile(this.filePath);

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
}

export default new ColumnStorage();
