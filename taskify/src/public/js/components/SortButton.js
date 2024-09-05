import Component from "../core/Component.js";
import { SORT_TEXT, SORT_TYPES } from "../constants/sortTypes.js";
import sortStore from "../stores/SortStore.js";

export default class SortButton extends Component {
  setup() {
    this.state = {
      sortTypes: Object.values(SORT_TYPES),
      currentSortTypeIndex: 0,
    };
  }

  template() {
    const sortText = this.getSortText();
    return `
        <span class="material-symbols-outlined">swap_vert</span>
        <span class="sort-btn-text">${sortText}</span>
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
