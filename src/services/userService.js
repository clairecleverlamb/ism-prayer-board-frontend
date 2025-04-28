import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/users`;

export async function createUser(username) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) throw new Error('Failed to create user');

  return await res.json();
}
