"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

type RegisterPayload = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterPayload>({
    full_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof RegisterPayload>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // ✅ simple client-side validation (optional but helpful)
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Call backend register
      await apiPost("/auth/register", form);

      // ✅ redirect to login after success
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1>Register</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          required
        />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />

        <input
          placeholder="Phone number"
          value={form.phone_number}
          onChange={(e) => updateField("phone_number", e.target.value)}
          required
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
        />

        <input
          placeholder="Confirm password"
          type="password"
          value={form.confirm_password}
          onChange={(e) => updateField("confirm_password", e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
      router.push(`/login?email=${encodeURIComponent(form.email)}`);

    </main>
  );
}
