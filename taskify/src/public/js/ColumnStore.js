import Store from "./core/Store.js";

class ColumnStore extends Store {
  updateColumnState(column_id, data, action, additionalData) {
    const updatedColumns = this.getUpdatedColumns(
      column_id,
      data,
      action,
      additionalData
    );
    this.setState({ columns: updatedColumns });
  }

  getUpdatedColumns(column_id, data, action, additionalData) {
    switch (action) {
      case "addTask":
        return this.state.columns.map((col) =>
          col.id === column_id ? { ...col, tasks: [...col.tasks, data] } : col
        );

      case "updateTaskContent":
        return this.state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) => (task.id === data.id ? data : task)),
        }));

      case "deleteTask":
        return this.state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== data),
        }));

      case "moveTask":
        const [sourceColumn, destinationColumn] = this.state.columns.reduce(
          (result, col) => {
            if (col.id === column_id) result[0] = col;
            if (col.id === additionalData) result[1] = col;
            return result;
          },
          [null, null]
        );

        return this.state.columns.map((col) => {
          if (col.id === sourceColumn.id) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== data.id),
            };
          }
          if (col.id === destinationColumn.id) {
            return {
              ...col,
              tasks: [...col.tasks, data],
            };
          }
          return col;
        });

      case "addColumn":
        return [...this.state.columns, data];

      case "updateColumnTitle":
        return this.state.columns.map((col) =>
          col.id === column_id ? { ...col, title: data.title } : col
        );

      case "deleteColumn":
        return this.state.columns.filter((col) => col.id !== column_id);

      default:
        return this.state.columns;
    }
  }
}

const columnStore = new ColumnStore();
export default columnStore;
