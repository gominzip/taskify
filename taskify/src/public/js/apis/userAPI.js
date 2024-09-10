import { handleAsync } from "../../utils/handleAsync.js";

export async function login(username, password) {
  return handleAsync(async () => {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "로그인 실패";
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  });
}

export async function logout() {
  return handleAsync(async () => {
    const response = await fetch("/user/logout", {
      method: "POST",
    });
    if (!response.ok) throw new Error("로그아웃 실패");
    const data = await response.json();
    return data;
  });
}

export async function getUserStatus() {
  return handleAsync(async () => {
    const response = await fetch("/user/status");
    if (!response.ok) throw new Error("사용자 상태 조회 실패");
    const data = await response.json();
    return data;
  });
}

export async function getUserInfo() {
  return handleAsync(async () => {
    const response = await fetch("/user/info");
    if (!response.ok) throw new Error("사용자 정보 가져오기 실패");
    const data = await response.json();
    return data.user;
  });
}
