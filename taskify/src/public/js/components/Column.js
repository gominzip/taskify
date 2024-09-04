import Component from "../core/Component.js";
import TaskAddForm from "./TaskAddForm.js";
import TaskList from "./TaskList.js";

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
    if (this.state.isAddingTask) {
      this.renderTaskAddForm();
    }
  }

  renderTasks() {
    const $taskListContainer = this.$target.querySelector(
      '[data-component="task-list"]'
    );
    $taskListContainer.innerHTML = "";

    const { tasks, column_id, deleteTask, updateTaskContent, moveTask } =
      this.props;

    new TaskList($taskListContainer, {
      tasks,
      column_id,
      deleteTask,
      updateTaskContent,
      moveTask,
    });
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

  setEvent() {
    this.addEvent("click", ".task-add-btn", this.toggleTaskAddForm.bind(this));
    this.addEvent("click", ".column-remove-btn", this.removeColumn.bind(this));
    this.addEvent("dblclick", ".editable-title", this.editTitle.bind(this));
  }

  hideTaskInputForm() {
    this.setState({ ...this.state, isAddingTask: false });
  }

  saveNewTask(title, description) {
    this.props.addTask(this.props.column_id, {
      title,
      description,
      author_id: 2,
    });
    this.hideTaskInputForm();
  }

  toggleTaskAddForm() {
    this.setState({ ...this.state, isAddingTask: !this.state.isAddingTask });
  }

  removeColumn() {
    this.props.deleteColumn(this.props.column_id);
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
    this.props.updateColumn(this.props.column_id, newTitle);
  }
}
