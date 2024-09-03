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
    new TaskEditForm(this.$target, {
      title: this.props.title,
      description: this.props.description,
      onCancel: this.handleCancelEdit.bind(this),
      onSave: this.handleSaveEdit.bind(this),
    });
  }

  setEvent() {
    this.addEvent("click", ".task-remove-btn", async () => {
      this.props.deleteTask(this.props.id);
    });

    this.addEvent("click", ".task-edit-btn", () => {
      this.setState({
        ...this.state,
        isEditing: !this.state.isEditing,
      });
    });
  }

  handleCancelEdit() {
    this.setState({
      ...this.state,
      isEditing: false,
      title: this.props.title,
      description: this.props.description,
    });
  }

  async handleSaveEdit(title, description) {
    try {
      await this.props.updateTask(this.props.columnId, this.props.id, {
        title,
        description,
      });
      this.setState({
        ...this.state,
        isEditing: false,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
