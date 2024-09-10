import Store from "../core/Store.js";

class UserStore extends Store {
  constructor() {
    super();
    this.state = {
      userInfo: null
    };
  }

  setUserInfo(userInfo) {
    this.setState({ userInfo });
  }
}

const userStore = new UserStore();
export default userStore;
