import { SORT_TEXT, SORT_TYPES } from "../constants/sortTypes.js";
import Component from "../core/Component.js";
import sortStore from "../stores/SortStore.js";

export default class Header extends Component {
  setup() {
    this.state = {
      sortTypes: Object.values(SORT_TYPES),
      currentSortTypeIndex: 0,
    };
  }

  template() {
    const sortText = this.getSortText();
    return `
        <div class="header-left-content">
          <p>TASKIFY</p>
          <button class="sort-btn">
            <span class="material-symbols-outlined">swap_vert</span>
            <span class="sort-btn-text">${sortText}</span>
          </button>
        </div>
        <button id="history-btn" class="material-symbols-outlined">history</button>
    `;
  }

  getSortText() {
    const { currentSortTypeIndex, sortTypes } = this.state;
    const sortType = sortTypes[currentSortTypeIndex];
    return SORT_TEXT[sortType] || "생성 순";
  }

  setEvent() {
    this.addEvent("click", ".sort-btn", this.handleSortClick.bind(this));
  }

  handleSortClick() {
    const { sortTypes, currentSortTypeIndex } = this.state;
    const nextIndex = (currentSortTypeIndex + 1) % sortTypes.length;
    const newSortType = sortTypes[nextIndex];

    this.setState({ currentSortTypeIndex: nextIndex });

    sortStore.setSortType(newSortType);
  }
}
