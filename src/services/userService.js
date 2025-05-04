import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/users`;

// Optional: Fetch all users (admin-only?)
export async function fetchAllUsers() {
  const res = await fetch(BASE_URL, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// Optional: Update user info (e.g., name)
export async function updateUser(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
