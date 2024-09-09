import { sortTasksByType } from "../../utils/sortUtil.js";
import { handleAsync } from "../../utils/handleAsync.js";
import { getColumn } from "../apis/columnAPI.js";
import ActionTypes from "../constants/actionTypes.js";
import Store from "../core/Store.js";
import { SORT_TYPES } from "../constants/sortTypes.js";

class ColumnStore extends Store {
  async updateColumnState(column_id, data, action, additionalData) {
    const updatedColumns = await this.getUpdatedColumns(
      column_id,
      data,
      action,
      additionalData
    );
    this.setState({ columns: updatedColumns, action });
  }

  getUpdatedColumns(column_id, data, action, additionalData) {
    switch (action) {
      case ActionTypes.ADD_TASK:
        return this.addTaskToColumn(column_id, data);

      case ActionTypes.UPDATE_TASK_CONTENT:
        return this.updateTaskContentInColumn(column_id, data);

      case ActionTypes.DELETE_TASK:
        return this.deleteTaskFromColumn(column_id, data);

      case ActionTypes.MOVE_TASK:
        return this.moveTask(column_id, additionalData);

      case ActionTypes.ADD_COLUMN:
        return this.addColumn(data);

      case ActionTypes.UPDATE_COLUMN_TITLE:
        return this.updateColumnTitle(column_id, data);

      case ActionTypes.DELETE_COLUMN:
        return this.deleteColumn(column_id);

      case ActionTypes.SORT:
        return this.sortTasksInColumns(data);

      default:
        return this.state.columns;
    }
  }

  addTaskToColumn(column_id, task) {
    return this.state.columns.map((col) =>
      col.id === column_id ? { ...col, tasks: [...col.tasks, task] } : col
    );
  }

  updateTaskContentInColumn(column_id, updatedTask) {
    return this.state.columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
  }

  deleteTaskFromColumn(column_id, taskId) {
    return this.state.columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => task.id !== taskId),
    }));
  }

  addColumn(newColumn) {
    return [...this.state.columns, newColumn];
  }

  updateColumnTitle(column_id, data) {
    return this.state.columns.map((col) =>
      col.id === column_id ? { ...col, title: data.title } : col
    );
  }

  deleteColumn(column_id) {
    return this.state.columns.filter((col) => col.id !== column_id);
  }

  sortTasksInColumns(sortType) {
    return this.state.columns.map((col) => ({
      ...col,
      tasks: sortTasksByType(col.tasks, sortType),
    }));
  }

  async moveTask(beforeColumnId, afterColumnId) {
    // Get the columns before and after the move operation
    const [beforeColumn, afterColumn] = await Promise.all([
      handleAsync(() => getColumn(beforeColumnId)),
      handleAsync(() => getColumn(afterColumnId)),
    ]);

    const sortedBeforeColumnTasks = sortTasksByType(
      beforeColumn.tasks,
      SORT_TYPES.PRIORITY
    );
    const sortedAfterColumnTasks = sortTasksByType(
      afterColumn.tasks,
      SORT_TYPES.PRIORITY
    );

    const updatedBeforeColumn = {
      ...beforeColumn,
      tasks: sortedBeforeColumnTasks,
    };
    const updatedAfterColumn = {
      ...afterColumn,
      tasks: sortedAfterColumnTasks,
    };

    return this.state.columns.map((col) => {
      if (col.id === beforeColumnId) return updatedBeforeColumn;
      if (col.id === afterColumnId) return updatedAfterColumn;
      return col;
    });
  }
}

const columnStore = new ColumnStore();
export default columnStore;
