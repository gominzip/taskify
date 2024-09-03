import {
  findClosestSibling,
  insertDraggingItem,
} from "../../utils/dragUtils.js";
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

    this.$target.addEventListener("dragstart", this.handleDragStart.bind(this));
    this.$target.addEventListener("dragend", this.handleDragEnd.bind(this));
    this.$target.addEventListener("dragover", this.handleDragOver.bind(this));
    this.$target.addEventListener("dragenter", (e) => e.preventDefault());
    this.$target.addEventListener("drop", this.processDrop.bind(this));
  }

  handleRemoveTask() {
    this.props.deleteTask(this.props.id);
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

  // 드래그앤드롭 구간
  handleDragStart(e) {
    e.target.style.opacity = "0.5";
    e.target.classList.add("dragging");
  }

  handleDragEnd(e) {
    this.processDrop(e);
    e.target.style.opacity = "1";
    e.target.classList.remove("dragging");
  }

  handleDragOver(e) {
    e.preventDefault();
    this.updateDropTarget(e);
  }

  updateDropTarget(e) {
    const draggingItem = document.querySelector(".dragging");
    const taskList = e.target.closest(".task-list");

    if (taskList && draggingItem) {
      taskList
        .querySelectorAll(".drop-target")
        .forEach((el) => el.classList.remove("drop-target"));

      const siblings = [
        ...taskList.querySelectorAll(".task-item-wrapper:not(.dragging)"),
      ];

      const closestSibling = findClosestSibling(siblings, e.clientY);

      if (closestSibling) {
        insertDraggingItem(taskList, draggingItem, closestSibling, e.clientY);
        closestSibling.classList.add("drop-target");
      } else {
        taskList.appendChild(draggingItem);
      }
    }
  }

  processDrop(e) {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const taskList = e.target.closest(".task-list");

    if (taskList && draggingItem) {
      const columnWrapper = taskList.closest(".task-column-wrapper");
      const oldColumnId = this.props.columnId;
      const newColumnId = columnWrapper ? columnWrapper.dataset.columnId : null;

      if (newColumnId) {
        const taskItems = [...taskList.querySelectorAll(".task-item-wrapper")];
        const newPosition = taskItems.indexOf(draggingItem);

        this.handleTaskMove(
          Number(oldColumnId),
          Number(newColumnId),
          newPosition + 1
        );

        document
          .querySelectorAll(".drop-target")
          .forEach((el) => el.classList.remove("drop-target"));
      } else {
        console.error("이동한 Column ID 없음");
      }
    }
  }

  // 데이터 패칭 구간
  async handleTaskMove(oldeColumnId, newColumnId, newTaskOrder) {
    await this.props.moveTask(oldeColumnId, newColumnId, this.props.id, {
      columnId: newColumnId,
      task_order: newTaskOrder,
    });
  }

  async handleSaveContentEdit(title, description) {
    await this.props.updateTaskContent(this.props.columnId, this.props.id, {
      title,
      description,
    });
  }
}
