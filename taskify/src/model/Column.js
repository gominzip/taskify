class Column {
  constructor(id, title, tasks = [], createdAt, updatedAt) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

export default Column;
