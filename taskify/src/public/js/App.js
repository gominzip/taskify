import Column from "./components/Column.js";
import Component from "./core/Component.js";

export default class App extends Component {
  setup() {
    this.state = {
      columns: [],
    };
  }

  template() {
    const { columns } = this.state;
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
    console.log(fetchedColumns);

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
      const $columnContainer = document.createElement("section");
      $columnContainer.className = 'task-column';
      $columnContainer.dataset.component = `TaskColumn-${column.id}`;
      $taskBoard.appendChild($columnContainer);

      new Column($columnContainer, {
        title: column.title,
        tasks: column.tasks,
      });
    });
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
