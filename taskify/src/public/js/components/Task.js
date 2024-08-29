import Component from "../core/Component.js";

export default class Task extends Component {
  setup() {
    this.state = { ...this.props };
  }

  template() {
    const { title, description, userName } = this.state;

    return `
     <div class="task-item">
        <div class="task-content">
          <div class="task-title-and-desription">
            <p class="task-content-title">${title}</p>
            <p class="task-content-description">${description}</p>
          </div>
          <p class="task-content-author">author by ${userName}</p>
        </div>
        <div class="task-buttons">
          <!--<button class="task-refresh-btn">🔄</button>-->
          <button class="task-remove-btn material-symbols-outlined">close</button>
          <button class="task-edit-btn material-symbols-outlined">edit</button>
        </div>
      </div>
    `;
  }

  setEvent() {
    this.addEvent("click", ".task-remove-btn", async () => {
      this.props.deleteTask(this.props.id);
    });

    this.addEvent("click", ".task-refresh-btn", async () => {
      this.refreshTask();
    });
  }

  async refreshTask() {
    try {
      this.setState({
        id: this.props.id,
        title: "부분 렌더링 테스트",
        description: "되나?",
        userName: "ㅇㅅㅇ",
      });
    } catch (error) {
      console.error(error);
    }
  }
}
