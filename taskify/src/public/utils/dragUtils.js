export function findClosestSibling(siblings, clientY) {
  let closestSibling = null;
  let minDistance = Number.POSITIVE_INFINITY;

  siblings.forEach((sibling) => {
    const siblingCenter = sibling.offsetTop + sibling.offsetHeight / 2;
    const distance = Math.abs(clientY - siblingCenter);

    if (distance < minDistance) {
      minDistance = distance;
      closestSibling = sibling;
    }
  });

  return closestSibling;
}

export function insertDraggingItem(
  taskList,
  draggingItem,
  closestSibling,
  clientY
) {
  const siblingCenter =
    closestSibling.offsetTop + closestSibling.offsetHeight / 2;
  if (clientY <= siblingCenter) {
    taskList.insertBefore(draggingItem, closestSibling);
  } else {
    const nextSibling = closestSibling.nextSibling;
    if (nextSibling) {
      taskList.insertBefore(draggingItem, nextSibling);
    } else {
      taskList.appendChild(draggingItem);
    }
  }
}
