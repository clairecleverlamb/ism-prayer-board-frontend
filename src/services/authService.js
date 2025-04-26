import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/auth`;

export async function login(username) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data; // { _id, username }
}
