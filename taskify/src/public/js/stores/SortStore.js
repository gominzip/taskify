import { SORT_TYPES } from "../constants/sortTypes.js";
import Store from "../core/Store.js";

class SortStore extends Store {
  constructor() {
    super();
    this.state = {
      sortType: SORT_TYPES.CREATED_AT,
    };
  }

  setSortType(newSortType) {
    this.setState({ sortType: newSortType });
  }
}

const sortStore = new SortStore();
export default sortStore;
