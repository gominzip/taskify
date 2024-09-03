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
    try {
      const columns = await getAllColumns();
      this.setState({ columns });
    } catch (error) {
      console.error(error);
    }
    this.renderColumns();
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
      $taskBoard.appendChild($columnContainer);

      new Column($columnContainer, {
        title: column.title,
        tasks: column.tasks ? column.tasks : [],
        columnId: column.id,
        addTask: this.addTask.bind(this),
        deleteTask: this.deleteTask.bind(this),
        updateTask: this.updateTaskContent.bind(this),
        deleteColumn: this.deleteColumn.bind(this),
        updateColumn: this.updateColumn.bind(this),
        moveTask: this.moveTask.bind(this),
      });
    });
  }

  async addTask(columnId, task) {
    try {
      const newTask = await createTask(columnId, task);
      this.setState({
        columns: this.state.columns.map((col) =>
          col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateTaskContent(columnId, taskId, updates) {
    try {
      const updatedTask = await updateTask(taskId, updates);
      this.setState({
        columns: this.state.columns.map((col) => {
          if (col.id === columnId) {
            return {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? updatedTask : task
              ),
            };
          }
          return col;
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async moveTask(beforeColumnId, afterColumnId, taskId, updates) {
    try {
      const response = await updateTask(taskId, updates);

      const updatedBeforeColumn = await getColumn(beforeColumnId);
      const updatedAfterColumn = await getColumn(afterColumnId);

      this.setState({
        columns: this.state.columns.map((column) => {
          if (column.id === beforeColumnId) {
            return updatedBeforeColumn;
          }
          if (column.id === afterColumnId) {
            return updatedAfterColumn;
          }
          return column;
        }),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTask(taskId) {
    try {
      await deleteTask(taskId);
      this.setState({
        columns: this.state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        })),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async addColumn() {
    try {
      const newColumn = await createColumn("New Column");
      this.setState({
        columns: [...this.state.columns, newColumn],
      });
    } catch (error) {
      console.error(error);
    }
  }

  async updateColumn(columnId, newTitle) {
    try {
      const updatedColumn = await updateColumnTitle(columnId, newTitle);
      this.setState({
        columns: this.state.columns.map((col) =>
          col.id === columnId ? { ...col, title: updatedColumn.title } : col
        ),
      });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteColumn(columnId) {
    try {
      await deleteColumn(columnId);
      this.setState({
        columns: this.state.columns.filter((col) => col.id !== columnId),
      });
    } catch (error) {
      console.error(error);
    }
  }

  setEvent() {
    this.addEvent("click", ".column-add-btn", () => {
      this.addColumn();
    });
  }
}
