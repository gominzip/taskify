import { handleAsync } from "../../utils/handleAsync.js";
import { deleteTask, updateTask } from "../apis/taskAPI.js";
import columnStore from "../stores/ColumnStore.js";
import Component from "../core/Component.js";
import TaskEditForm from "./TaskEditForm.js";
import ActionTypes from "../constants/actionTypes.js";
import { SORT_TYPES } from "../constants/sortTypes.js";
import sortStore from "../stores/SortStore.js";

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
      onSave: this.updateTaskContent.bind(this),
    });
  }

  setEvent() {
    this.addEvent("click", ".task-remove-btn", this.deleteTask.bind(this));
    this.addEvent("click", ".task-edit-btn", this.toggleEditMode.bind(this));

    const $taskItemWrapper = this.$target;

    $taskItemWrapper.addEventListener(
      "dragstart",
      this.handleDragStart.bind(this)
    );
    $taskItemWrapper.addEventListener("dragend", this.handleDragEnd.bind(this));
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
    if (sortStore.getState().sortType !== SORT_TYPES.PRIORITY) {
      e.target.classList.remove("dragging");
      alert("중요도 순 정렬일 때만 드래그 앤 드롭이 가능합니다.");
      return;
    }
    e.target.style.opacity = "0.5";
    e.target.classList.add("dragging");
  }

  handleDragEnd(e) {
    e.target.style.opacity = "1";
    e.target.classList.remove("dragging");
  }

  async updateTaskContent(title, description) {
    const { id, column_id } = this.state;
    const updatedTask = await handleAsync(() =>
      updateTask(id, {
        title,
        description,
      })
    );
    columnStore.updateColumnState(
      column_id,
      updatedTask,
      ActionTypes.UPDATE_TASK_CONTENT
    );
  }

  async deleteTask() {
    const { id, column_id } = this.state;
    await handleAsync(() => deleteTask(id));
    columnStore.updateColumnState(column_id, id, ActionTypes.DELETE_TASK);
  }
}
