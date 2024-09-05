import { handleAsync } from "../utils/handleAsync.js";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
  getColumn,
  updateColumnTitle,
} from "./apis/columnAPI.js";
import { createTask, deleteTask, updateTask } from "./apis/taskAPI.js";
import Component from "./core/Component.js";
import ColumnList from "./components/ColumnList.js";

export default class App extends Component {
  setup() {
    this.state = {
      columns: [],
    };
  }

  template() {
    return `
      <header>
        <div class="header-left-content">
          <p>TASKIFY</p>
          <button class="sort-btn">
            <span class="material-symbols-outlined">swap_vert</span>
            <span class="sort-btn-text">생성 순</span>
          </button>
        </div>
        <button id="history-btn" class="material-symbols-outlined">history</button>
      </header>
      <main id="task-board"></main>
      <div class="fixed-action-buttons">
        <button class="undo-btn" aria-label="Undo">
          <span class="material-symbols-outlined">undo</span>
        </button>
        <button class="redo-btn" aria-label="Redo">
          <span class="material-symbols-outlined">redo</span>
        </button>
        <button class="column-add-btn" aria-label="Add Column">
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>
    `;
  }

  async mounted() {
    const columns = await handleAsync(() => getAllColumns());
    if (columns) {
      this.setState({ columns });
    }
  }

  setState(newState) {
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.state = { ...this.state, ...newState };
      this.renderColumns();
    }
  }

  renderColumns() {
    const $taskBoardContainer = this.$target.querySelector("#task-board");
    $taskBoardContainer.innerHTML = "";

    new ColumnList($taskBoardContainer, {
      columns: this.state.columns,
      addTask: this.addTask.bind(this),
      deleteTask: this.deleteTask.bind(this),
      updateTaskContent: this.updateTaskContent.bind(this),
      moveTask: this.moveTask.bind(this),
      deleteColumn: this.deleteColumn.bind(this),
      updateColumn: this.updateColumn.bind(this),
    });
  }

  setEvent() {
    this.addEvent("click", ".column-add-btn", () => {
      this.addColumn();
    });
  }

  updateColumnState(column_id, updateFn) {
    this.setState({
      columns: this.state.columns.map((col) =>
        col.id === column_id ? updateFn(col) : col
      ),
    });
  }

  async addTask(column_id, task) {
    const newTask = await handleAsync(() => createTask(column_id, task));
    this.updateColumnState(column_id, (col) => ({
      ...col,
      tasks: [...col.tasks, newTask],
    }));
  }

  async updateTaskContent(column_id, taskId, updates) {
    const updatedTask = await handleAsync(() => updateTask(taskId, updates));
    this.updateColumnState(column_id, (col) => ({
      ...col,
      tasks: col.tasks.map((task) => (task.id === taskId ? updatedTask : task)),
    }));
  }

  async moveTask(beforeColumnId, afterColumnId, taskId, updates) {
    await handleAsync(() => updateTask(taskId, updates));
    const [updatedBeforeColumn, updatedAfterColumn] = await Promise.all([
      handleAsync(() => getColumn(beforeColumnId)),
      handleAsync(() => getColumn(afterColumnId)),
    ]);

    this.setState({
      columns: this.state.columns.map((col) => {
        if (col.id === beforeColumnId) return updatedBeforeColumn;
        if (col.id === afterColumnId) return updatedAfterColumn;
        return col;
      }),
    });
  }

  async deleteTask(column_id, taskId) {
    await handleAsync(() => deleteTask(taskId));
    this.updateColumnState(column_id, (col) => ({
      ...col,
      tasks: col.tasks.filter((task) => task.id !== taskId),
    }));
  }

  async addColumn() {
    const newColumn = await handleAsync(() => createColumn("New Column"));
    this.setState({
      columns: [...this.state.columns, newColumn],
    });
  }

  async updateColumn(column_id, newTitle) {
    const updatedColumn = await handleAsync(() =>
      updateColumnTitle(column_id, newTitle)
    );
    this.updateColumnState(column_id, (col) => ({
      ...col,
      title: updatedColumn.title,
    }));
  }

  async deleteColumn(column_id) {
    await handleAsync(() => deleteColumn(column_id));
    this.setState({
      columns: this.state.columns.filter((col) => col.id !== column_id),
    });
  }
}
