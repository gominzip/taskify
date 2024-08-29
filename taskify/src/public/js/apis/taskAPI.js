export async function getTask(taskId) {
  try {
    const response = await fetch(`/task/${taskId}`);
    if (!response.ok) throw new Error(`테스크 ${taskId} 패칭 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTask(columnId, task) {
  try {
    const response = await fetch(`/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId, ...task }),
    });
    if (!response.ok) throw new Error(`테스크 생성 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateTask(taskId, task) {
  try {
    const response = await fetch(`/task/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error(`테스크 ${taskId} 업데이트 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteTask(taskId) {
  try {
    const response = await fetch(`/task/${taskId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`테스크 ${taskId} 삭제 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
