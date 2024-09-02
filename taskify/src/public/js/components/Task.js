import Component from "../core/Component.js";

export default class Task extends Component {
  setup() {
    this.state = {
      ...this.props,
      isEditing: false,
      originalTitle: this.props.title,
      originalDescription: this.props.description,
    };
  }

  template() {
    const { title, description, userName, isEditing } = this.state;

    if (isEditing) {
      return `
        <div class="task-input-form">
            <div class="task-title-and-desription">
              <input type="text" class="task-content-title" value="${title}" placeholder="제목을 입력하세요"/>
              <textarea class="task-content-description" placeholder="내용을 입력하세요">${description}</textarea>
            </div>
          <div class="task-edit-buttons">
            <button class="task-cancel-btn">취소</button>
            <button class="task-save-btn enabled">확인</button>
          </div>
        </div>
      `;
    }
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

  setEvent() {
    this.addEvent("click", ".task-remove-btn", async () => {
      this.props.deleteTask(this.props.id);
    });

    this.addEvent("click", ".task-edit-btn", () => {
      this.setState(
        {
          ...this.state,
          isEditing: !this.state.isEditing,
        },
        () => {
          this.addInputEventListeners();
        }
      );
    });

    this.addEvent("click", ".task-cancel-btn", () => {
      this.setState({
        ...this.state,
        isEditing: false,
        title: this.state.originalTitle,
        description: this.state.originalDescription,
      });
    });

    this.addEvent("click", ".task-save-btn", async () => {
      const title = this.$target
        .querySelector(".task-content-title")
        .value.trim();
      const description = this.$target
        .querySelector(".task-content-description")
        .value.trim();

      if (title && description) {
        try {
          await this.props.updateTask(this.props.columnId, this.props.id, {
            title,
            description,
          });
          this.setState({
            ...this.state,
            isEditing: false,
            title,
            description,
          });
        } catch (error) {
          console.error(error);
        }
      }
    });

    this.addEvent(
      "input",
      ".task-content-title",
      this.checkInputValues.bind(this)
    );
    this.addEvent(
      "input",
      ".task-content-description",
      this.checkInputValues.bind(this)
    );
  }

  addInputEventListeners() {
    const titleInput = this.$target.querySelector(".task-content-title");
    const descriptionInput = this.$target.querySelector(
      ".task-content-description"
    );

    titleInput.addEventListener("input", this.checkInputValues.bind(this));
    descriptionInput.addEventListener(
      "input",
      this.checkInputValues.bind(this)
    );

    this.checkInputValues();
  }

  checkInputValues() {
    const title = this.$target
      .querySelector(".task-content-title")
      .value.trim();
    const description = this.$target
      .querySelector(".task-content-description")
      .value.trim();
    const saveButton = this.$target.querySelector(".task-save-btn");

    if (title && description) {
      saveButton.disabled = false;
      saveButton.classList.add("enabled");
    } else {
      saveButton.disabled = true;
      saveButton.classList.remove("enabled");
    }
  }
}
