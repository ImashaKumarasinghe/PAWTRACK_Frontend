// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set in .env.local");
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // If backend returns error, show it nicely
  if (!res.ok) {
    let message = "Request failed";
    try {
      const data = await res.json();
      message = data?.detail || JSON.stringify(data);
    } catch {}
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
