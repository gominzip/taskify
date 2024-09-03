import Component from "../core/Component.js";

export default class TaskAddForm extends Component {
  template() {
    return `
      <div class="task-input-form">
        <div class="task-title-and-description">
          <input type="text" class="task-content-title" placeholder="제목을 입력하세요" />
          <textarea class="task-content-description" placeholder="내용을 입력하세요"></textarea>
        </div>
        <div class="task-edit-buttons">
          <button class="task-cancel-btn">취소</button>
          <button class="task-save-btn" disabled>등록</button>
        </div>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", ".task-cancel-btn", this.handleCancel.bind(this));
    this.addEvent("click", ".task-save-btn", this.handleSave.bind(this));
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

  handleCancel() {
    this.props.onCancel();
  }

  handleSave() {
    const $saveButton = this.$target.querySelector(".task-save-btn");

    if (!$saveButton.disabled) {
      const title = this.getTitleInputValue().trim();
      const description = this.getDescriptionInputValue().trim();

      if (title && description) {
        this.props.onSave(title, description);
      }
    }
  }

  checkInputValues() {
    const $saveButton = this.$target.querySelector(".task-save-btn");

    const titleFilled = this.getTitleInputValue().trim() !== "";
    const descriptionFilled = this.getDescriptionInputValue().trim() !== "";

    this.toggleSaveButtonState($saveButton, titleFilled && descriptionFilled);
  }

  getTitleInputValue() {
    return this.$target.querySelector(".task-content-title").value;
  }

  getDescriptionInputValue() {
    return this.$target.querySelector(".task-content-description").value;
  }

  toggleSaveButtonState($saveButton, isEnabled) {
    $saveButton.disabled = !isEnabled;
    $saveButton.classList.toggle("enabled", isEnabled);
  }
}
