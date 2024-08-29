import { handleAsync } from "../../utils/handleAsync.js";

export async function getTask(taskId) {
  return handleAsync(async () => {
    const response = await fetch(`/task/${taskId}`);
    if (!response.ok) throw new Error(`테스크 ${taskId} 패칭 실패`);
    const data = await response.json();
    return data.data;
  });
}

export async function createTask(columnId, task) {
  return handleAsync(async () => {
    const response = await fetch(`/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ columnId, ...task }),
    });
    if (!response.ok) throw new Error(`테스크 생성 실패`);
    const data = await response.json();
    return data.data;
  });
}

export async function updateTask(taskId, task) {
  return handleAsync(async () => {
    const response = await fetch(`/task/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error(`테스크 ${taskId} 업데이트 실패`);
    const data = await response.json();
    return data.data;
  });
}

export async function deleteTask(taskId) {
  return handleAsync(async () => {
    const response = await fetch(`/task/${taskId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`테스크 ${taskId} 삭제 실패`);
    const data = await response.json();
    return data.data;
  });
}
