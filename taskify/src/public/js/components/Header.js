import Component from "../core/Component.js";

export default class Header extends Component {
  template() {
    return `
        <div class="header-left-content">
          <p>TASKIFY</p>
          <button class="sort-btn">
            <span class="material-symbols-outlined">swap_vert</span>
            <span class="sort-btn-text">생성 순</span>
          </button>
        </div>
        <button id="history-btn" class="material-symbols-outlined">history</button>
    `;
  }

  setEvent() {
    this.addEvent("click", ".sort-btn", this.handleSortClick.bind(this));
  }

  handleSortClick() {}
}
