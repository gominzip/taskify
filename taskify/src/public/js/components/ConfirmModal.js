import Component from "../core/Component.js";

class ConfirmModal extends Component {
  static instance = null;

  constructor($target) {
    if (ConfirmModal.instance) {
      return ConfirmModal.instance;
    }
    super($target, {});
    ConfirmModal.instance = this;
    this.modalText = "안내 문구를 이렇게 표시합니다.";
    this.confirmBtnText = "확인";
    this.onDelete = null;
    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {
    this.state = {
      isOpen: false,
    };
  }

  template() {
    return `
      <div class="modal-overlay" style="display: ${
        this.state.isOpen ? "block" : "none"
      }">
        <div class="modal-content">
          <p class="modal-text">${this.modalText}</p>
          <div class="modal-buttons">
            <button class="modal-button modal-cancel-btn">취소</button>
            <button class="modal-button modal-delete-btn">${this.confirmBtnText}</button>
          </div>
        </div>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", ".modal-cancel-btn", this.close.bind(this));
    this.addEvent("click", ".modal-delete-btn", this.handleDelete.bind(this));
  }

  open(mainText, btnText, onDeleteCallback) {
    this.modalText = mainText;
    this.confirmBtnText = btnText;
    this.onDelete = onDeleteCallback;
    this.setState({ isOpen: true });
  }

  close() {
    this.setState({ isOpen: false });
  }

  handleDelete() {
    if (this.onDelete) {
      this.onDelete();
    }
    this.close();
  }
}

export default ConfirmModal;
