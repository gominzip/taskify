import { handleAsync } from "../../utils/handleAsync.js";
import { deleteColumn, updateColumnTitle } from "../apis/columnAPI.js";
import { createTask } from "../apis/taskAPI.js";
import columnStore from "../ColumnStore.js";
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

    new TaskList($taskListContainer, {
      tasks: this.state.tasks,
      column_id: this.state.id,
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
    this.addEvent("click", ".column-remove-btn", this.deleteColumn.bind(this));
    this.addEvent("dblclick", ".editable-title", this.editTitle.bind(this));
  }

  hideTaskInputForm() {
    this.setState({ ...this.state, isAddingTask: false });
  }

  saveNewTask(title, description) {
    this.addTask({
      title,
      description,
      author_id: 2,
    });
    this.hideTaskInputForm();
  }

  toggleTaskAddForm() {
    this.setState({ ...this.state, isAddingTask: !this.state.isAddingTask });
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
      this.updateColumn(newTitle);
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
      this.state.title;
  }

  async addTask(task) {
    const column_id = this.state.id;
    const newTask = await handleAsync(() => createTask(column_id, task));
    columnStore.updateColumnState(column_id, newTask, "addTask");
  }

  async updateColumn(newTitle) {
    const column_id = this.state.id;
    const updatedColumn = await handleAsync(() =>
      updateColumnTitle(column_id, newTitle)
    );
    columnStore.updateColumnState(
      column_id,
      updatedColumn,
      "updateColumnTitle"
    );
  }

  async deleteColumn() {
    const column_id = this.state.id;
    await handleAsync(() => deleteColumn(column_id));
    columnStore.updateColumnState(column_id, null, "deleteColumn");
  }
}
