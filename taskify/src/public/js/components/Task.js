import Component from "../core/Component.js";
import TaskEditForm from "./TaskEditForm.js";

export default class Task extends Component {
  setup() {
    this.state = {
      ...this.props,
      isEditing: false,
    };
  }

  template() {
    const { title, description, userName } = this.state;

    return `
     <div class="task-item">
        <div class="task-content">
          <div class="task-title-and-desription">
            <p class="task-content-title">${title}</p>
            <p class="task-content-description">${description}</p>
          </div>
          <p class="task-content-author">author by ${userName}</p>
        </div>
        <div class="task-buttons">
          <button class="task-remove-btn material-symbols-outlined">close</button>
          <button class="task-edit-btn material-symbols-outlined">edit</button>
        </div>
      </div>
    `;
  }

  mounted() {
    if (this.state.isEditing) {
      this.renderTaskEditForm();
    }
  }

  renderTaskEditForm() {
    const { title, description } = this.props;
    new TaskEditForm(this.$target, {
      title,
      description,
      onCancel: this.handleCancelEdit.bind(this),
      onSave: this.handleSaveContentEdit.bind(this),
    });
  }

  setEvent() {
    this.addEvent(
      "click",
      ".task-remove-btn",
      this.handleRemoveTask.bind(this)
    );
    this.addEvent("click", ".task-edit-btn", this.toggleEditMode.bind(this));

    const $taskItemWrapper = this.$target;

    $taskItemWrapper.addEventListener("dragstart", this.handleDragStart);
    $taskItemWrapper.addEventListener("dragend", this.handleDragEnd.bind(this));
  }

  handleRemoveTask() {
    this.props.deleteTask(this.props.columnId, this.props.id);
  }

  toggleEditMode() {
    this.setState({ isEditing: true });
  }

  handleCancelEdit() {
    this.setState({
      ...this.state,
      isEditing: false,
      title: this.props.title,
      description: this.props.description,
    });
  }

  handleDragStart(e) {
    e.target.style.opacity = "0.5";
    e.target.classList.add("dragging");
  }

  handleDragEnd(e) {
    e.target.style.opacity = "1";
    e.target.classList.remove("dragging");
  }

  async handleSaveContentEdit(title, description) {
    await this.props.updateTaskContent(this.props.columnId, this.props.id, {
      title,
      description,
    });
  }
}
