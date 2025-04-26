import { SERVER_URL } from "./serverAPI";

const BASE_URL = `${SERVER_URL}/prayers`;

export async function getPrayers() {
  const res = await fetch(BASE_URL);
  return await res.json();
}

export async function createPrayer({ studentName, content, createdBy }) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ studentName, content, createdBy }),
  });
  return await res.json();
}

export async function prayFor(prayerId, userId) {
  const res = await fetch(`${BASE_URL}/${prayerId}/pray`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  return await res.json();
}

export async function unprayFor(prayerId, userId) {
  const res = await fetch(`${BASE_URL}/${prayerId}/unpray`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });
  return await res.json();
}
