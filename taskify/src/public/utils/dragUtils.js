export function findClosestSibling(siblings, clientY) {
  return siblings.reduce(
    (closest, sibling) => {
      const siblingCenter = sibling.offsetTop + sibling.offsetHeight / 2;
      const distance = Math.abs(clientY - siblingCenter);

      if (distance < closest.minDistance) {
        return { sibling, minDistance: distance };
      }

      return closest;
    },
    { sibling: null, minDistance: Number.POSITIVE_INFINITY }
  ).sibling;
}

export function insertDraggingItem(
  taskList,
  draggingItem,
  closestSibling,
  clientY
) {
  const siblingCenter =
    closestSibling.offsetTop + closestSibling.offsetHeight / 2;
  const insertBeforeNode =
    clientY <= siblingCenter ? closestSibling : closestSibling.nextSibling;

  taskList.insertBefore(draggingItem, insertBeforeNode || null);
}
