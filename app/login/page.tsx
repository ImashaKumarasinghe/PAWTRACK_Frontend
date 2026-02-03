"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import styles from "./login.module.css";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof LoginPayload>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const data = await apiPost<LoginResponse>("/auth/login", form);

      // ✅ store token in localStorage
      localStorage.setItem("token", data.access_token);

      // ✅ go to home page or dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
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
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Login to continue helping street pets 🐾
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            required
          />

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className={styles.footer}>
          Don't have an account?{" "}
          <a href="/register" className={styles.link}>
            Register here
          </a>
        </p>
      </section>
    </main>
  );
}
