import Component from "../core/Component.js";

export default class Task extends Component {
  template() {
    const { title, description, userName } = this.props;

    return `
        <h4>${title}</h4>
        <p>${description}</p>
        <p>author by ${userName}</p>
    `;
  }
}
