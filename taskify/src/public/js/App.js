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
        <h1>TASKIFY</h1>
        <button id="history-btn" class="material-symbols-outlined">history</button>
      </header>
      <main id="task-board">
      </main>
    `;
  }

  async mounted() {
    const fetchedColumns = await fetchData();
    this.setState({
      columns: fetchedColumns,
    });
    this.renderColumns();
  }

  renderColumns() {
    const { columns } = this.state;
    const $taskBoard = this.$target.querySelector("#task-board");

    $taskBoard.innerHTML = "";

    columns.forEach((column) => {
      const $columnContainer = document.createElement("div");
      $columnContainer.dataset.component = `TaskColumn-${column.id}`;
      $columnContainer.className='task-column-wrapper';
      $taskBoard.appendChild($columnContainer);

      new Column($columnContainer, {
        title: column.title,
        tasks: column.tasks,
        columnId: column.id,
        addTask: this.addTask.bind(this), // 자식에게 메서드 전달
        deleteTask: this.deleteTask.bind(this),
      });
    });
  }

  async addTask(columnId, task) {
    try {
      const response = await fetch(`/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId, ...task }),
      });
      if (response.ok) {
        const newTask = await response.json();
        this.setState({
          columns: this.state.columns.map((col) =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          ),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await fetch(`/task/${taskId}`, { method: "DELETE" });
      if (response.ok) {
        this.setState({
          columns: this.state.columns.map((col) => ({
            ...col,
            tasks: col.tasks.filter((task) => task.id !== taskId),
          })),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  setEvent() {
    this.addEvent("click", "#history-btn", () => {
      console.log("히스토리 버튼 클릭");
    });
  }
}

async function fetchData() {
  try {
    const response = await fetch("/column");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
