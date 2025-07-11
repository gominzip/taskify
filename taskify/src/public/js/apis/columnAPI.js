import { handleAsync } from "../../utils/handleAsync.js";

export async function getAllColumns() {
  return handleAsync(async () => {
    const response = await fetch(`/column`);
    if (!response.ok) throw new Error("전체데이터 패칭 실패");
    const data = await response.json();
    return data.data;
  });
}

export async function getColumn(column_id) {
  return handleAsync(async () => {
    const response = await fetch(`/column/${column_id}`);
    if (!response.ok) throw new Error(`컬럼 ${column_id} 패칭 실패`);
    const data = await response.json();
    return data.data;
  });
}

export async function createColumn(title) {
  return handleAsync(async () => {
    const response = await fetch(`/column`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("컬럼 생성 실패");
    const data = await response.json();
    return data.data;
  });
}

export async function updateColumnTitle(column_id, newTitle) {
  return handleAsync(async () => {
    const response = await fetch(`/column/${column_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) throw new Error(`컬럼 ${id} 업데이트 실패`);
    const data = await response.json();
    return data.data;
  });
}

export async function deleteColumn(column_id) {
  return handleAsync(async () => {
    const response = await fetch(`/column/${column_id}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`컬럼 ${id} 삭제 실패`);
    return await response.json();
  });
}
