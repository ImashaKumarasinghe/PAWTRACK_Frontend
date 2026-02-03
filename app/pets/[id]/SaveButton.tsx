"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveButton({ petId }: { petId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");

    // ✅ 1) Check login when user clicks
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // ✅ 2) Send token in Authorization header
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pets/${petId}/save`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        // Try to read FastAPI error nicely
        let msg = "Failed to adopt pet";
        try {
          const data = await res.json();
          msg = data?.detail || JSON.stringify(data);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      // ✅ 3) After saving, go back home and refresh list and go to adapted page
      router.push(`/adopted/${petId}`);
         router.refresh();

    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          padding: "10px 14px",
          border: "none",
          borderRadius: 10,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Saving..." : "✅ Adopt Now"}
      </button>

      {error ? <p style={{ color: "red", marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
