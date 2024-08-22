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
}

export default new ColumnStorage();
