import Component from "../core/Component.js";
import Task from "./Task.js";

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
        <div class="task-list" data-component="task-list">
        </div>
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
      $taskList.appendChild($taskContainer);

      new Task($taskContainer, {
        ...task,
        deleteTask: this.props.deleteTask,
      });
    });

    if (this.state.isAddingTask) {
      this.renderTaskInputForm();
    }
  }

  renderTaskInputForm() {
    const $taskList = this.$target.querySelector(
      '[data-component="task-list"]'
    );

    const $inputForm = document.createElement("div");
    $inputForm.classList.add("task-input-form");
    $inputForm.innerHTML = `
      <div class="task-title-and-desription">
        <input type="text" class="task-content-title" placeholder="제목을 입력하세요" />
        <textarea class="task-content-description" placeholder="내용을 입력하세요"></textarea>
      </div>
      <div class="task-edit-buttons">
        <button class="task-cancel-btn">취소</button>
        <button class="task-save-btn">등록</button>
      </div>
    `;

    $taskList.prepend($inputForm);
    this.addTaskInputListeners();
  }

  hideTaskInputForm() {
    const $inputForm = this.$target.querySelector(".task-input-form");
    if ($inputForm) {
      $inputForm.remove();
    }
    this.setState({ ...this.state, isAddingTask: false });
  }

  addTaskInputListeners() {
    const $titleInput = this.$target.querySelector(".task-content-title");
    const $descriptionInput = this.$target.querySelector(
      ".task-content-description"
    );
    const $saveButton = this.$target.querySelector(".task-save-btn");

    const checkInputValues = () => {
      const titleFilled = $titleInput.value.trim() !== "";
      const descriptionFilled = $descriptionInput.value.trim() !== "";

      if (titleFilled && descriptionFilled) {
        $saveButton.disabled = false;
        $saveButton.classList.add("enalbed");
      } else {
        $saveButton.disabled = true;
        $saveButton.classList.remove("enalbed");
      }
    };

    this.addEvent("click", ".task-cancel-btn", () => {
      this.hideTaskInputForm();
    });
    this.addEvent("click", ".task-save-btn", () => {
      if (!$saveButton.disabled) {
        const title = $titleInput.value.trim();
        const description = $descriptionInput.value.trim();

        if (title && description) {
          this.props.addTask(this.props.columnId, {
            title,
            description,
            authorId: 2,
          });
          this.hideTaskInputForm();
        }
      }
    });

    $titleInput.addEventListener("input", checkInputValues);
    $descriptionInput.addEventListener("input", checkInputValues);
  }

  setEvent() {
    this.addEvent("click", ".task-add-btn", () => {
      const { isAddingTask } = this.state;
      if (isAddingTask) {
        this.setState({ ...this.state, isAddingTask: false }, () => {
          this.hideTaskInputForm();
        });
      } else {
        this.setState({ ...this.state, isAddingTask: true }, () => {
          this.renderTaskInputForm();
        });
      }
    });

    this.addEvent("click", ".column-remove-btn", () => {
      this.props.deleteColumn(this.props.columnId);
    });
    this.addEvent("dblclick", ".editable-title", this.editTitle.bind(this));
    this.addEvent("blur", ".edit-column-input ", this.saveTitle.bind(this));
    this.addEvent("keydown", ".edit-column-input ", (e) => {
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
    const $input = this.$target.querySelector(".edit-column-input");

    if (
      $input &&
      !$input.contains(e.target) &&
      !$editableTitle.contains(e.target)
    ) {
      this.saveTitle({ target: $input });
    }
  }

  editTitle(e) {
    const $title = e.target;
    const currentTitle = $title.textContent.trim();
    this.$target.classList.add("editing");

    if (!$title.querySelector(".edit-column-input")) {
      $title.innerHTML = `<input type="text" class="edit-column-input" value="${currentTitle}">`;
      const $input = $title.querySelector(".edit-column-input");
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
    $title.innerHTML = $title.querySelector(".edit-column-input").value.trim();
  }

  async updateTitle(newTitle) {
    try {
      this.props.updateColumn(this.props.columnId, newTitle);
    } catch (error) {
      console.error(error);
    }
  }

  destroy() {
    this.removeEventListeners();
  }
}
