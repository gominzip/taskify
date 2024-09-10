import { login } from "./apis/userAPI.js";
import { handleAsync } from "../utils/handleAsync.js";

const loginForm = document.querySelector("#login-form");
const loginError = document.querySelector("#login-error");

const handleLogin = async (event) => {
  event.preventDefault();

  const username = loginForm.querySelector('input[name="username"]').value;
  const password = loginForm.querySelector('input[name="password"]').value;

  try {
    await handleAsync(() => login(username, password));
    window.location.href = "/";
  } catch (error) {
    loginError.textContent = error.message || "로그인 실패";
  }
};

if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}
