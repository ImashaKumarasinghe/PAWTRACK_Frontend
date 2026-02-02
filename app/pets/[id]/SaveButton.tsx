"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SaveButton({ petId }: { petId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`http://127.0.0.1:9000/pets/${petId}/save`, {
        method: "POST",
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save pet");
      }

      // After saving, go back home and refresh list
      router.push("/");
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
        {loading ? "Saving..." : "✅ Mark as Saved"}
      </button>

      {error ? <p style={{ color: "red", marginTop: 8 }}>{error}</p> : null}
    </div>
  );
}
