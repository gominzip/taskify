import { handleAsync } from "../../utils/handleAsync.js";
import { createColumn } from "../apis/columnAPI.js";
import columnStore from "../ColumnStore.js";
import Component from "../core/Component.js";

export default class FAB extends Component {
  template() {
    return `
        <button class="undo-btn" aria-label="Undo">
          <span class="material-symbols-outlined">undo</span>
        </button>
        <button class="redo-btn" aria-label="Redo">
          <span class="material-symbols-outlined">redo</span>
        </button>
        <button class="column-add-btn" aria-label="Add Column">
          <span class="material-symbols-outlined">add</span>
        </button>
    `;
  }

  setEvent() {
    this.addEvent("click", ".column-add-btn", this.handleAddColumn);
  }

  async handleAddColumn() {
    const newColumn = await handleAsync(() => createColumn("New Column"));
    if (newColumn) {
      columnStore.updateColumnState(null, newColumn, "addColumn");
    }
  }
}
