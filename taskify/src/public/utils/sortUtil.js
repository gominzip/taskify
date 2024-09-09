import { SORT_TYPES } from "../js/constants/sortTypes.js";

export function sortTasksByType(tasks, sortType) {
  if (sortType === SORT_TYPES.PRIORITY) {
    return tasks.sort((a, b) => a.task_order - b.task_order);
  }

  if (sortType === SORT_TYPES.CREATED_AT) {
    return tasks.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
  }

  if (sortType === SORT_TYPES.UPDATED_AT) {
    return tasks.sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    );
  }

  return tasks;
}
