export async function getAllColumns() {
  try {
    const response = await fetch(`/column`);
    if (!response.ok) throw new Error("전체데이터 패칭 실패");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getColumn(columnId) {
  try {
    const response = await fetch(`/column/${columnId}`);
    if (!response.ok) throw new Error(`컬럼 ${columnId} 패칭 실패`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createColumn(title) {
  try {
    const response = await fetch(`/column`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!response.ok) throw new Error("컬럼 생성 실패");
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateColumnTitle(columnId, newTitle) {
  try {
    const response = await fetch(`/column/${columnId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
    if (!response.ok) throw new Error(`컬럼 ${id} 업데이트 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteColumn(columnId) {
  try {
    const response = await fetch(`/column/${columnId}`, { method: "DELETE" });
    if (!response.ok) throw new Error(`컬럼 ${id} 삭제 실패`);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}
