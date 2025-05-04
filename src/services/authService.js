// services/authService.js
import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/auth`;

// Fetch the current logged-in user from the cookie-based session
export async function fetchCurrentUser() {
  const res = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include", // Send cookies with request
  });

  if (!res.ok) {
    throw new Error("Unauthorized");
  }

  return res.json(); // { _id, email, name, isAdmin, ... }
}

// Logout (clear token cookie)
export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json(); // { message: "Logged out successfully" }
}
