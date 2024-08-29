import Component from "../core/Component.js";
import Task from "./Task.js";

export default class Column extends Component {
  setup() {
    this.state = { ...this.props };
  }

  template() {
    const { title, tasks } = this.state;

    return `
      <section class="task-column">
        <div class="task-column-header">
          <div class="task-column-title">
            <span class="editable-title">${title}</span>
            <span class="task-count">${tasks.length}</span>
          </div>
          <div class="task-column-controls">
            <button class="task-add-btn material-symbols-outlined">add</button>
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
    this.addEventListeners();
  }

  addEventListeners() {
    this.addEvent("click", ".task-add-btn", () => {
      const newTask = {
        title: "새로운 테스크 생성",
        description: "입력은 아직 안받아여",
        authorId: 1,
      };
      this.props.addTask(this.props.columnId, newTask);
    });

    this.addEvent("dblclick", ".editable-title", this.editTitle.bind(this));
    this.addEvent("blur", ".edit-title-input", this.saveTitle.bind(this));
    this.addEvent("keydown", ".edit-title-input", (e) => {
      if (e.key === "Enter") {
        this.saveTitle(e);
      } else if (e.key === "Escape") {
        this.cancelEdit(e);
      }
    });
    document.addEventListener("click", this.handleClickOutside.bind(this));
  }

  removeEventListeners() {
    document.removeEventListener("click", this.handleClickOutside.bind(this));
  }

  handleClickOutside(e) {
    const $editableTitle = this.$target.querySelector(".editable-title");
    const $input = this.$target.querySelector(".edit-title-input");

    if (
      $input &&
      !$input.contains(e.target) &&
      !$editableTitle.contains(e.target)
    ) {
      this.saveTitle({ target: $input });
    }
  }

  renderTasks() {
    const $taskList = this.$target.querySelector(
      '[data-component="task-list"]'
    );
    $taskList.innerHTML = "";

    const { tasks } = this.state;

    tasks.forEach((task) => {
      const $taskContainer = document.createElement("div");
      $taskContainer.className = "task-item-wrapper";
      $taskList.appendChild($taskContainer);

      new Task($taskContainer, {
        ...task,
        deleteTask: this.props.deleteTask,
      });
    });
  }

  editTitle(e) {
    const $title = e.target;
    const currentTitle = $title.textContent.trim();
    this.$target.classList.add("editing");

    if (!$title.querySelector(".edit-title-input")) {
      $title.innerHTML = `<input type="text" class="edit-title-input" value="${currentTitle}">`;
      const $input = $title.querySelector(".edit-title-input");
      $input.focus();
    }
  }

  saveTitle(e) {
    const $input = e.target;
    const $title = $input.parentElement;
    const newTitle = $input.value.trim();

    if (newTitle && newTitle !== $title.textContent.trim()) {
      this.updateTitle(newTitle);
    } else {
      this.cancelEdit(e);
    }
    this.$target.classList.remove("editing");
  }

  cancelEdit(e) {
    const $input = e.target;
    const $title = $input.parentElement;
    $title.innerHTML = $title.querySelector(".edit-title-input").value.trim();
  }

  async updateTitle(newTitle) {
    try {
      const response = await fetch(`/column/${this.props.columnId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) {
        throw new Error("타이틀 수정 실패");
      }

      this.setState({ ...this.state, title: newTitle });
    } catch (error) {
      console.error(error);
    }
  }

  destroy() {
    this.removeEventListeners();
  }
}
