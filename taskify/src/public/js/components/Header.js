import { handleAsync } from "../../utils/handleAsync.js";
import { logout } from "../apis/userAPI.js";
import { SORT_TEXT } from "../constants/sortTypes.js";
import Component from "../core/Component.js";
import userStore from "../stores/UserStore.js";
import ConfirmModal from "./ConfirmModal.js";
import HistoryModal from "./HistoryModal.js";
import SortButton from "./SortButton.js";

export default class Header extends Component {
  setup() {
    this.state = {
      isHistoryModalOpen: false,
    };
    this.historyModal = null;
    this.sortBtn = null;
    this.confirmModal = new ConfirmModal();
  }

  template() {
    const { name } = userStore.getState().userInfo;
    return `
        <div class="header-left-content">
          <p>TASKIFY</p>
          <button class="sort-btn"></button>
        </div>
        <div class="header-right-content">
          <div class="header-user-info">
            <span class="header-user-name">${name} 님</span>
            <button class="logout-btn material-symbols-outlined">logout</button>
          </div>
          <button class="history-btn material-symbols-outlined">history</button>
        </div>
        <div class="history-modal"></div>
    `;
  }

  getSortText() {
    const { currentSortTypeIndex, sortTypes } = this.state;
    const sortType = sortTypes[currentSortTypeIndex];
    return SORT_TEXT[sortType] || "생성 순";
  }

  setEvent() {
    this.addEvent("click", ".history-btn", this.toggleHistoryModal.bind(this));
    this.addEvent("click", ".logout-btn", this.confirmLogout.bind(this));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  mounted() {
    this.initializeSortButton();
    this.initializeHistoryModal();
  }

  initializeSortButton() {
    if (!this.sortBtn) {
      const container = this.$target.querySelector(".sort-btn");
      this.sortBtn = new SortButton(container);
    }
  }

  initializeHistoryModal() {
    if (!this.historyModal) {
      const container = this.$target.querySelector(".history-modal");
      this.historyModal = new HistoryModal(container, {
        isOpen: this.state.isHistoryModalOpen,
        onClose: () => this.setState({ isHistoryModalOpen: false }),
      });
      this.updateModalVisibility();
    }
  }

  toggleHistoryModal() {
    const newIsOpenState = !this.state.isHistoryModalOpen;
    this.setState({ isHistoryModalOpen: newIsOpenState });
    this.updateModalVisibility();
  }

  updateModalVisibility() {
    if (this.historyModal) {
      this.historyModal.updateModalVisibility(this.state.isHistoryModalOpen);
    }
  }

  confirmLogout() {
    this.confirmModal.open(
      "로그아웃 하시겠습니까?",
      "로그아웃",
      this.handleLogout.bind()
    );
  }

  async handleLogout() {
    await handleAsync(() => logout());
    window.location.href = "/login";
  }
}
