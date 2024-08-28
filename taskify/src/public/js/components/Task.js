import Component from "../core/Component.js";

export default class Task extends Component {
  template() {
    const { id, title, description, userName } = this.props;

    return `
     <div class="task-item" data-task-id="${id}">
        <button class="task-delete-btn">❌</button>
        <h4>${title}</h4>
        <p>${description}</p>
        <p>author by ${userName}</p>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", ".task-delete-btn", async () => {
      this.props.deleteTask(this.props.id);
    });
  }
}
