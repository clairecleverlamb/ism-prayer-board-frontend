import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/prayers`;

// GET all prayers
export async function getPrayers() {
  const res = await fetch(BASE_URL, {
    credentials: "include", 
  });
  if (!res.ok) throw new Error("Failed to fetch prayers");
  return await res.json();
}

// POST create a new prayer
export async function createPrayer({ studentName, ministryGroup = "", content, status = "" }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify({ studentName, ministryGroup, status, content }),
  });
  if (!res.ok) throw new Error("Failed to create prayer");
  return await res.json();
}

// PATCH pray for a prayer (JWT-based)
export async function prayFor(prayerId) {
  const res = await fetch(`${BASE_URL}/${prayerId}/pray`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify({}),
  });
  if (!res.ok) throw new Error("Failed to pray for prayer");
  return await res.json();
}

// PATCH unprayFor is no longer needed separately

// PATCH update a prayer (if you allow it)
export async function updatePrayer(prayerId, updatedFields) {
  const res = await fetch(`${BASE_URL}/${prayerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedFields),
  });
  if (!res.ok) throw new Error("Failed to update prayer");
  return await res.json();
}

// DELETE a prayer
export async function deletePrayer(prayerId) {
  const res = await fetch(`${BASE_URL}/${prayerId}`, {
    method: "DELETE",
    credentials: "include", 
  });
  if (!res.ok) throw new Error("Failed to delete prayer");
  return await res.json();
}
