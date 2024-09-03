import Component from "../core/Component.js";
import Task from "./Task.js";
import TaskAddForm from "./TaskAddForm.js";

export default class Column extends Component {
  setup() {
    this.state = { ...this.props, isAddingTask: false };
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
        <div class="task-list" data-component="task-list"></div>
      </section>
    `;
  }

  mounted() {
    this.renderTasks();
  }

  renderTasks() {
    const $taskList = this.$target.querySelector(
      '[data-component="task-list"]'
    );
    $taskList.innerHTML = "";

    this.state.tasks.forEach((task) => {
      const $taskContainer = document.createElement("div");
      $taskContainer.className = "task-item-wrapper";
      $taskContainer.draggable = "true";
      $taskList.appendChild($taskContainer);

      new Task($taskContainer, {
        ...task,
        deleteTask: this.props.deleteTask,
        updateTaskContent: this.props.updateTaskContent,
        moveTask: this.props.moveTask,
      });
    });

    if (this.state.isAddingTask) {
      this.renderTaskAddForm();
    }
  }

  renderTaskAddForm() {
    const $taskList = this.$target.querySelector(
      '[data-component="task-list"]'
    );
    const $taskAddContainer = document.createElement("div");
    $taskList.prepend($taskAddContainer);

    new TaskAddForm($taskAddContainer, {
      onCancel: this.hideTaskInputForm.bind(this),
      onSave: this.saveNewTask.bind(this),
    });
  }

  hideTaskInputForm() {
    this.setState({ ...this.state, isAddingTask: false });
  }

  saveNewTask(title, description) {
    this.props.addTask(this.props.columnId, {
      title,
      description,
      authorId: 2,
    });
    this.hideTaskInputForm();
  }

  setEvent() {
    this.addEvent("click", ".task-add-btn", this.toggleTaskAddForm.bind(this));
    this.addEvent("click", ".column-remove-btn", this.removeColumn.bind(this));
    this.addEvent("dblclick", ".editable-title", this.editTitle.bind(this));
  }

  toggleTaskAddForm() {
    this.setState({ ...this.state, isAddingTask: !this.state.isAddingTask });
  }

  removeColumn() {
    this.props.deleteColumn(this.props.columnId);
  }

  editTitle(e) {
    const $title = e.target;
    const currentTitle = $title.textContent.trim();
    this.$target.classList.add("editing");

    if (!$title.querySelector(".edit-column-input")) {
      $title.innerHTML = `<input type="text" class="edit-column-input" value="${currentTitle}">`;
      const $input = $title.querySelector(".edit-column-input");
      $input.focus();
      document.addEventListener("click", this.handleGlobalClick.bind(this));
    }
  }

  saveTitle(e) {
    const $input = e.target;
    const newTitle = $input.value.trim();

    if (newTitle && newTitle !== this.props.title) {
      this.updateTitle(newTitle);
      $title.innerHTML = newTitle;
    } else {
      this.cancelTitleEdit(e);
    }
    this.$target.classList.remove("editing");
    document.removeEventListener("click", this.handleGlobalClick.bind(this));
  }

  handleGlobalClick(e) {
    const $input = this.$target.querySelector(".edit-column-input");

    if ($input && !$input.contains(e.target)) {
      this.saveTitle({ target: $input });
    }
  }

  cancelTitleEdit() {
    this.$target.querySelector(".editable-title").textContent =
      this.props.title;
  }

  async updateTitle(newTitle) {
    this.props.updateColumn(this.props.columnId, newTitle);
  }
}
