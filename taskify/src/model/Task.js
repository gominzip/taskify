class Task {
  constructor(
    id,
    columnId,
    title,
    description,
    authorId,
    order,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.columnId = columnId;
    this.title = title;
    this.description = description;
    this.authorId = authorId;
    this.order = order;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

export default Task;
