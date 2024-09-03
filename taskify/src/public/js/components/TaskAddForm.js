import TaskForm from "./TaskForm.js";

export default class TaskAddForm extends TaskForm {
  template() {
    return `
      <div class="task-input-form">
        <div class="task-input-content">
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
}
