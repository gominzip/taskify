import Component from "../core/Component.js";
import Task from "./Task.js";

export default class Column extends Component {
  template() {
    const { title, tasks } = this.props;
    console.log("$taskList:", tasks);
    return `
      <section class="task-column">
        <div class="task-column-header">
          <div class="task-column-title">
            <span>${title}</span>
            <span class="task-count">${tasks.length}</span>
          </div>
          <div class="task-column-controls">
            <button class="column-add-btn material-symbols-outlined">add</button>
            <button class="column-remove-btn material-symbols-outlined">close</button>
          </div>
        </div>
        <div class="task-list" data-component="task-list">
        </div>
      </section>
    `;
  }

  mounted() {
    this.renderTasks();
  }

  renderTasks() {
    // class와 data-component의 선택자 차이 이해하기...
    const $taskList = this.$target.querySelector(
      '[data-component="task-list"]'
    );

    $taskList.innerHTML = "";

    const { tasks } = this.props;

    tasks.forEach((task) => {
      const $taskContainer = document.createElement("div");
      $taskList.appendChild($taskContainer);

      new Task($taskContainer, task);
    });
  }
}
