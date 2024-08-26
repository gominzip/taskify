class Task {
  constructor(
    id,
    columnId,
    title,
    description,
    authorId,
    task_order,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.authorId = authorId;
    this.task_order = task_order;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

export default Task;
