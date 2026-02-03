"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import styles from "./register.module.css";

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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // ✅ simple client-side validation
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
  <main className={styles.page}>
    {/* ✅ Background Video */}
    <div className={styles.videoWrapper}>
      <video
        className={styles.bgVideo}
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/pets-bg.mp4.mp4" type="video/mp4" />
      </video>

      <div className={styles.videoOverlay} />
    </div>

    <section className={styles.card}>
      <h1 className={styles.title}>Create Account</h1>
      <p className={styles.subtitle}>
        Join PawTrack to help street pets find safe homes 🐾
      </p>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Full name"
          value={form.full_name}
          onChange={(e) => updateField("full_name", e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Phone number"
          value={form.phone_number}
          onChange={(e) => updateField("phone_number", e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Confirm password"
          type="password"
          value={form.confirm_password}
          onChange={(e) => updateField("confirm_password", e.target.value)}
          required
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className={styles.footer}>
        Already have an account?{" "}
        <a href="/login" className={styles.link}>
          Login here
        </a>
      </p>
    </section>
  </main>
);

}
