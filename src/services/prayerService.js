import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/prayers`;

// GET all prayers
export async function getPrayers() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch prayers");
  return await res.json();
}

// POST create a new prayer
export async function createPrayer({ studentName, ministryGroup = "", content, createdBy }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentName, ministryGroup, content, createdBy }),
  });
  if (!res.ok) throw new Error("Failed to create prayer");
  return await res.json();
}

// PATCH pray for a prayer
export async function prayFor(prayerId, userId) {
  const res = await fetch(`${BASE_URL}/${prayerId}/pray`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }), // <-- userId included
  });
  if (!res.ok) throw new Error("Failed to pray for prayer");
  return await res.json();
}

// PATCH unpray a prayer
export async function unprayFor(prayerId, userId) {
  const res = await fetch(`${BASE_URL}/${prayerId}/unpray`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }), // <-- userId included
  });
  if (!res.ok) throw new Error("Failed to unpray for prayer");
  return await res.json();
}

// PATCH update a prayer (for editing content)
export async function updatePrayer(prayerId, updatedFields) {
  const res = await fetch(`${BASE_URL}/${prayerId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFields),
  });
  if (!res.ok) throw new Error("Failed to update prayer");
  return await res.json();
}

// DELETE a prayer
export async function deletePrayer(prayerId) {
  const res = await fetch(`${BASE_URL}/${prayerId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete prayer");
  return await res.json();
}
