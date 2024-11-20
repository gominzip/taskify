import { historyDummy } from "../apis/historyAPI.js";
import Component from "../core/Component.js";
import { generateHistoryHTML } from "../../utils/generateHistoryHTML.js";
import ConfirmModal from "./ConfirmModal.js";

export default class HistoryModal extends Component {
  setup() {
    this.state = {
      isOpen: this.props.isOpen || false,
    };

    this.confirmModal = new ConfirmModal();
  }

  template() {
    return `
      <div class="history-header">
        <div class="history-header-title">사용자 활동 기록</div>
        <button class="history-close-btn">
          <span class="history-close-icon material-symbols-outlined">close</span>
          <span class="history-close-text">닫기</span>
        </button>
      </div>
      <div class="histories">
        ${historyDummy.map((history) => generateHistoryHTML(history)).join("")}
      </div>
      <div class="history-reset-wrapper">
        <button class="history-reset-btn">기록 전체 삭제</button>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", ".history-close-btn", this.close.bind(this));
    this.addEvent(
      "click",
      ".history-reset-btn",
      this.confirmResetHistory.bind(this)
    );
  }

  open() {
    this.setState({ isOpen: true });
    this.updateModalVisibility();
  }

  close() {
    this.setState({ isOpen: false });
    this.props.onClose();
    this.updateModalVisibility();
  }

  updateModalVisibility(isOpen) {
    if (isOpen) {
      this.$target.classList.add("open");
    } else {
      this.$target.classList.remove("open");
    }
  }

  confirmResetHistory() {
    this.confirmModal.open(
      "모든 사용자 활동 기록을 삭제할까요?",
      "삭제",
      this.resetHistory
    );
  }

  async resetHistory() {
    console.log("구현 예정");
  }
}
