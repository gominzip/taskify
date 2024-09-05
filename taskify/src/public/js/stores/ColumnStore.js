import { handleAsync } from "../../utils/handleAsync.js";
import { getColumn } from "../apis/columnAPI.js";
import ActionTypes from "../constants/actionTypes.js";
import Store from "../core/Store.js";

class ColumnStore extends Store {
  async updateColumnState(column_id, data, action, additionalData) {
    const updatedColumns = await this.getUpdatedColumns(
      column_id,
      data,
      action,
      additionalData
    );
    this.setState({ columns: updatedColumns });
  }

  getUpdatedColumns(column_id, data, action, additionalData) {
    switch (action) {
      case ActionTypes.ADD_TASK:
        return this.state.columns.map((col) =>
          col.id === column_id ? { ...col, tasks: [...col.tasks, data] } : col
        );

      case ActionTypes.UPDATE_TASK_CONTENT:
        return this.state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) => (task.id === data.id ? data : task)),
        }));

      case ActionTypes.DELETE_TASK:
        return this.state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== data),
        }));

      case ActionTypes.MOVE_TASK:
        return this.moveTask(column_id, additionalData);

      case ActionTypes.ADD_COLUMN:
        return [...this.state.columns, data];

      case ActionTypes.UPDATE_COLUMN_TITLE:
        return this.state.columns.map((col) =>
          col.id === column_id ? { ...col, title: data.title } : col
        );

      case ActionTypes.DELETE_COLUMN:
        return this.state.columns.filter((col) => col.id !== column_id);

      default:
        return this.state.columns;
    }
  }

  async moveTask(beforeColumnId, afterColumnId) {
    const [updatedBeforeColumn, updatedAfterColumn] = await Promise.all([
      handleAsync(() => getColumn(beforeColumnId)),
      handleAsync(() => getColumn(afterColumnId)),
    ]);

    return this.state.columns.map((col) => {
      if (col.id === beforeColumnId) return updatedBeforeColumn;
      if (col.id === afterColumnId) return updatedAfterColumn;
      return col;
    });
  }
}

const columnStore = new ColumnStore();
export default columnStore;
