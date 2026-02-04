"use client";

import Link from "next/link";
import { useState } from "react";

type Pet = {
  id: number;
  title: string;
  species: string;
  description?: string | null;
  photo_url?: string | null;
};

export default function AdoptedPetCard({ pet }: { pet: Pet }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/adopted/${pet.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="pet-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          cursor: "pointer",
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.2s",
        }}
      >
        <div className="pet-card-image">
          {pet.photo_url ? (
            <img
              src={pet.photo_url}
              alt={pet.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="pet-card-image-placeholder">
              {pet.species === "DOG" ? "🐕" : pet.species === "CAT" ? "🐈" : "🐾"}
            </div>
          )}
        </div>

        <div className="pet-card-content">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#7b4a12",
              marginBottom: 4,
            }}
          >
            {pet.title}
          </h2>
          <p style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>
            {pet.species}
          </p>
          {pet.description && (
            <p className="pet-card-description">{pet.description}</p>
          )}
        </div>

        <div className="pet-card-footer">
          <span
            style={{
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 6,
              background: "#22c55e",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ✓ Adopted
          </span>
        </div>
      </div>
    </Link>
  );
}
