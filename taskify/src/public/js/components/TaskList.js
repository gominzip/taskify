import { handleAsync } from "../../utils/handleAsync.js";
import { sortTasksByType } from "../../utils/sortUtil.js";
import { getTask, updateTask } from "../apis/taskAPI.js";
import columnStore from "../stores/ColumnStore.js";
import Component from "../core/Component.js";
import Task from "./Task.js";
import ActionTypes from "../constants/actionTypes.js";
import sortStore from "../stores/SortStore.js";

export default class TaskList extends Component {
  setup() {
    this.state = { ...this.props };
    console.log(this.state);
    sortStore.subscribe(this.handleSortChange.bind(this));
  }

  handleSortChange({ sortType }) {
    this.sortTasks(sortType);
  }

  sortTasks(sortType) {
    const { tasks } = this.state;

    const sortedTasks = sortTasksByType(tasks, sortType);
    this.animateTaskSorting(sortedTasks);
  }

  animateTaskSorting(sortedTasks) {
    const $taskList = this.$target;
    const taskElements = Array.from($taskList.children);

    const taskPositions = taskElements.reduce((acc, taskElement, index) => {
      const taskId = taskElement.dataset.id;
      acc[taskId] = { element: taskElement, index };
      return acc;
    }, {});

    const newTaskOrder = sortedTasks.map(
      (task) => taskPositions[task.id].element
    );

    newTaskOrder.forEach((taskElement, newIndex) => {
      const { index: currentIndex } = taskPositions[taskElement.dataset.id];

      if (newIndex !== currentIndex) {
        const offset =
          (newIndex - currentIndex) * (taskElement.offsetHeight * 1.1);
        taskElement.style.transform = `translateY(${offset}px)`;

        taskElement.addEventListener(
          "transitionend",
          () => {
            if (newTaskOrder.indexOf(taskElement) === newIndex) {
              if (newIndex === taskElements.length - 1) newIndex++;
              $taskList.insertBefore(
                taskElement,
                $taskList.children[newIndex] || null
              );
            }

            taskElement.style.transform = "";
          },
          { once: true }
        );
      }
    });
  }

  mounted() {
    this.renderTasks();
    this.setDragAndDropEvents();
  }

  renderTasks() {
    const { tasks, column_id } = this.props;
    const $taskList = this.$target;

    $taskList.innerHTML = "";

    tasks.forEach((task) => {
      const $taskContainer = document.createElement("div");
      $taskContainer.className = "task-item-wrapper";
      $taskContainer.draggable = "true";
      $taskContainer.dataset.id = task.id;
      $taskContainer.dataset.column_id = column_id;
      $taskList.appendChild($taskContainer);

      new Task($taskContainer, {
        ...task,
      });
    });
  }

  setDragAndDropEvents() {
    const $taskList = this.$target;

    $taskList.addEventListener("dragover", this.handleDragOver.bind(this));
    $taskList.addEventListener("drop", this.handleDrop.bind(this));
  }

  handleDragOver(e) {
    e.preventDefault();

    const draggingItem = document.querySelector(".dragging");
    if (!draggingItem) return;

    const taskList = e.target.closest(".task-list");
    if (!taskList) return;

    const afterElement = this.getDragAfterElement(taskList, e.clientY);

    if (afterElement == null) {
      taskList.appendChild(draggingItem);
    } else {
      taskList.insertBefore(draggingItem, afterElement);
    }
  }

  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".task-item-wrapper:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  handleDrop(e) {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const taskList = e.target.closest(".task-list");

    if (taskList && draggingItem) {
      taskList.classList.remove("drop-target");

      this.processDrop(e);
    }
  }

  processDrop(e) {
    const draggingItem = document.querySelector(".dragging");
    const taskList = e.target.closest(".task-list");

    if (taskList && draggingItem) {
      const columnWrapper = taskList.closest(".task-column-wrapper");
      const afterColumnId = columnWrapper
        ? columnWrapper.dataset.column_id
        : null;
      const beforeColumnId = draggingItem.dataset.column_id;
      const taskId = draggingItem.dataset.id;

      if (afterColumnId) {
        const taskItems = [...taskList.querySelectorAll(".task-item-wrapper")];
        const newPosition = taskItems.indexOf(draggingItem);

        this.moveTask(
          Number(taskId),
          Number(beforeColumnId),
          Number(afterColumnId),
          newPosition + 1
        );

        document
          .querySelectorAll(".drop-target")
          .forEach((el) => el.classList.remove("drop-target"));
      } else {
        console.error("이동한 Column ID 없음");
      }
    }
  }

  async moveTask(taskId, beforeColumnId, afterColumnId, newTaskOrder) {
    await handleAsync(() =>
      updateTask(taskId, {
        column_id: afterColumnId,
        task_order: newTaskOrder,
      })
    );

    const updatedTask = await handleAsync(() => getTask(taskId));
    columnStore.updateColumnState(
      beforeColumnId,
      updatedTask,
      ActionTypes.MOVE_TASK,
      afterColumnId
    );
  }
}
