import Component from "../core/Component.js";

export default class Task extends Component {
  template() {
    const { id, title, description, userName } = this.props;

    return `
     <div class="task-item" data-task-id="${id}">
        <h4>${title}</h4>
        <p>${description}</p>
        <p>author by ${userName}</p>
      </div>
    `;
  }
}
