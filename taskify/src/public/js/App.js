import { handleAsync } from "../utils/handleAsync.js";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
  getColumn,
  updateColumnTitle,
} from "./apis/columnAPI.js";
import { createTask, deleteTask, updateTask } from "./apis/taskAPI.js";
import Column from "./components/Column.js";
import Component from "./core/Component.js";

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
    const { columns } = this.state;
    const $taskBoard = this.$target.querySelector("#task-board");
    $taskBoard.innerHTML = "";

    columns.forEach((column) => {
      const $columnContainer = document.createElement("div");
      $columnContainer.className = "task-column-wrapper";
      $columnContainer.dataset.columnId = column.id;

      new Column($columnContainer, {
        title: column.title,
        tasks: column.tasks || [],
        columnId: column.id,
        addTask: this.addTask.bind(this),
        deleteTask: this.deleteTask.bind(this),
        updateTaskContent: this.updateTaskContent.bind(this),
        moveTask: this.moveTask.bind(this),
        deleteColumn: this.deleteColumn.bind(this),
        updateColumn: this.updateColumn.bind(this),
      });

      $taskBoard.appendChild($columnContainer);
    });
  }

  setEvent() {
    this.addEvent("click", ".column-add-btn", () => {
      this.addColumn();
    });
  }

  updateColumnState(columnId, updateFn) {
    this.setState({
      columns: this.state.columns.map((col) =>
        col.id === columnId ? updateFn(col) : col
      ),
    });
  }

  async addTask(columnId, task) {
    const newTask = await handleAsync(() => createTask(columnId, task));
    this.updateColumnState(columnId, (col) => ({
      ...col,
      tasks: [...col.tasks, newTask],
    }));
  }

  async updateTaskContent(columnId, taskId, updates) {
    const updatedTask = await handleAsync(() => updateTask(taskId, updates));
    this.updateColumnState(columnId, (col) => ({
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

  async deleteTask(columnId, taskId) {
    await handleAsync(() => deleteTask(taskId));
    this.updateColumnState(columnId, (col) => ({
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

  async updateColumn(columnId, newTitle) {
    const updatedColumn = await handleAsync(() =>
      updateColumnTitle(columnId, newTitle)
    );
    this.updateColumnState(columnId, (col) => ({
      ...col,
      title: updatedColumn.title,
    }));
  }

  async deleteColumn(columnId) {
    await handleAsync(() => deleteColumn(columnId));
    this.setState({
      columns: this.state.columns.filter((col) => col.id !== columnId),
    });
  }
}
