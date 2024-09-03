import TaskForm from "./TaskForm.js";

export default class TaskEditForm extends TaskForm {
  template() {
    const { title, description } = this.props;

    return `
      <div class="task-input-form">
        <div class="task-title-and-description">
          <input type="text" class="task-content-title" value="${title}" placeholder="제목을 입력하세요"/>
          <textarea class="task-content-description" placeholder="내용을 입력하세요">${description}</textarea>
        </div>
        <div class="task-edit-buttons">
          <button class="task-cancel-btn">취소</button>
          <button class="task-save-btn" disabled>저장</button>
        </div>
      </div>
    `;
  }
}
