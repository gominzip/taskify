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
        ${columns
          .map(
            ({ title, tasks }) => `
            <section class="task-column">
              <div class="task-column-header">
                <div class="task-column-title">
                  <span>${title}</span>
                  <span class="task-count">${tasks.length}</span>
                </div>
                <div class="task-column-controls">
            <button class="column-add-btn material-symbols-outlined">
              add
            </button>
            <button class="column-remove-btn material-symbols-outlined">
              close
            </button>
          </div>
              </div>
              <div class="task-list">
                ${tasks
                  .map(
                    ({ id, title, description }) => `
                    <div class="task-item">
                      <h4>${title}</h4>
                      <p>${description}</p>
                      <p>author by web</p>
                    </div>
                  `
                  )
                  .join("")}
              </div>
            </section>
          `
          )
          .join("")}
      </main>
    `;
  }

  async mounted() {
    const fetchedColumns = await fetchData();
    console.log(fetchedColumns);

    this.setState({
      columns: fetchedColumns,
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
