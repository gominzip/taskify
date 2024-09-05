import columnStore from "../stores/ColumnStore.js";
import Component from "../core/Component.js";
import Column from "./Column.js";

export default class ColumnList extends Component {
  setup() {
    this.state = columnStore.getState();
    columnStore.subscribe((state) => {
      this.state = state;
      this.renderColumns();
    });
    this.renderColumns();
  }

  mounted() {
    this.renderColumns();
  }

  renderColumns() {
    const $taskBoard = this.$target;
    $taskBoard.innerHTML = "";

    const { columns } = this.state;

    columns.forEach((column) => {
      const $columnContainer = document.createElement("div");
      $columnContainer.className = "task-column-wrapper";
      $columnContainer.dataset.column_id = column.id;

      new Column($columnContainer, {
        ...column,
      });

      $taskBoard.appendChild($columnContainer);
    });
  }
}
