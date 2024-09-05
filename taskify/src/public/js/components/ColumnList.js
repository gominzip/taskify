import Component from "../core/Component.js";
import Column from "./Column.js";

export default class ColumnList extends Component {
  setup() {
    this.state = {
      columns: this.props.columns || [],
    };
  }

  mounted() {
    this.renderColumns();
  }

  renderColumns() {
    const $taskBoard = this.$target;
    $taskBoard.innerHTML = "";

    this.state.columns.forEach((column) => {
      const $columnContainer = document.createElement("div");
      $columnContainer.className = "task-column-wrapper";
      $columnContainer.dataset.column_id = column.id;

      new Column($columnContainer, {
        title: column.title,
        tasks: column.tasks || [],
        column_id: column.id,
        addTask: this.props.addTask,
        deleteTask: this.props.deleteTask,
        updateTaskContent: this.props.updateTaskContent,
        moveTask: this.props.moveTask,
        deleteColumn: this.props.deleteColumn,
        updateColumn: this.props.updateColumn,
      });

      $taskBoard.appendChild($columnContainer);
    });
  }
}
