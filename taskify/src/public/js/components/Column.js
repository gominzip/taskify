import Component from "../core/Component.js";

export default class Column extends Component {
  template() {
    const { title, tasks } = this.props;
    return `
      <section class="task-column">
        <div class="task-column-header">
          <div class="task-column-title">
            <span>${title}</span>
            <span class="task-count">${tasks.length}</span>
          </div>
          <div class="task-column-controls">
            <button class="column-add-btn material-symbols-outlined">add</button>
            <button class="column-remove-btn material-symbols-outlined">close</button>
          </div>
        </div>
        <div class="task-list">
          ${tasks
            .map(
              ({ id, title, description, userName }) => `
                <div class="task-item">
                  <h4>${title}</h4>
                  <p>${description}</p>
                  <p>author by ${userName}</p>
                </div>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  }
}
