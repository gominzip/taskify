class Task {
  constructor(columnId, title, description, authorId, task_order) {
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.authorId = authorId;
    this.task_order = task_order;
  }
}

export default Task;
