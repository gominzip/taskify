import columnStore from "../js/stores/ColumnStore.js";
import { handleAsync } from "../utils/handleAsync.js";
import { getAllColumns } from "./apis/columnAPI.js";
import Component from "./core/Component.js";
import ColumnList from "./components/ColumnList.js";
import Header from "./components/Header.js";
import FAB from "./components/FAB.js";
import { getUserInfo } from "./apis/userAPI.js";
import userStore from "./stores/UserStore.js";

export default class App extends Component {
  template() {
    return `
      <header id="header-container"></header>
      <main id="task-board-container"></main>
      <section id="fab-container"></section>
    `;
  }

  async mounted() {
    await this.loadUserInfo();
    await this.loadColumns();
    this.renderAppLayout();
  }

  async loadUserInfo() {
    const userInfo = await handleAsync(() => getUserInfo());
    userStore.setUserInfo(userInfo);
  }

  async loadColumns() {
    const columns = await handleAsync(() => getAllColumns());
    if (columns) {
      columnStore.setState({ columns });
    }
  }

  renderAppLayout() {
    const $headerContainer = this.$target.querySelector("#header-container");
    const $taskBoardContainer = this.$target.querySelector(
      "#task-board-container"
    );
    const $fabContainer = this.$target.querySelector("#fab-container");

    $taskBoardContainer.innerHTML = "";

    new Header($headerContainer);
    new ColumnList($taskBoardContainer);
    new FAB($fabContainer);
  }
}
