"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on client
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // small helper to highlight active link
  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        borderBottom: "1px solid #eee",
        padding: "14px 18px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      {/* Logo  */}
      <Link
  href="/"
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  }}
>
  <Image
    src="/logo (2).jpg"
    alt="PawTrack logo"
    width={36}
    height={36}
    priority
    style={{ borderRadius: "50%", objectFit: "cover" }}
  />
  <span style={{ fontWeight: 700, fontSize: 18, color: "#7b4a12" }}>
    PawTrack
  </span>
</Link>


      {/* Nav Links */}
      <nav style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            fontWeight: isActive("/") ? 700 : 500,
            color: "#7b4a12",
          }}
        >
          Home
        </Link>

        {/* Adopted list page (you’ll create this route) */}
        <Link
          href="/adopted"
          style={{
            textDecoration: "none",
            fontWeight: isActive("/adopted") ? 700 : 500,
            color: "#7b4a12",
          }}
        >
          Adopted
        </Link>

        {/* Add New Pet (significant label) */}
        <Link
          href="/pets/new"
          style={{
            textDecoration: "none",
            padding: "8px 12px",
            borderRadius: 10,
            background: "#7b4a12",
            color: "white",
            fontWeight: 600,
          }}
        >
          + Report a Street Pet
        </Link>

        {/* Login/Logout */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              background: "#ef4444",
              color: "white",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            style={{
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 8,
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
