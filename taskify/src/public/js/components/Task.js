import Component from "../core/Component.js";

export default class Task extends Component {
  setup() {
    this.state = { ...this.props }; // 초기상태를 props로
  }

  template() {
    const { id, title, description, userName } = this.state;

    return `
     <div class="task-item" data-task-id="${id}">
        <button class="task-refresh-btn">🔄</button>
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
