import Link from "next/link";
import SaveButton from "./SaveButton";

type Pet = {
  id: number;
  title: string;
  species: string;
  description?: string | null;
  location_url: string;
  location_text?: string | null;
  status: string;
  created_at: string;
};

async function getPet(id: string): Promise<Pet> {
  const res = await fetch(`http://127.0.0.1:9000/pets/${id}`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch pet (${res.status}): ${text}`);
  }

  return res.json();
}

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Fix params Promise
  const pet = await getPet(id);

  return (
    <main style={{ padding: 24, fontFamily: "Arial", maxWidth: 700, margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 12 }}>
        ← Back
      </Link>

      <h1 style={{ fontSize: 26, fontWeight: "bold" }}>
        {pet.title} ({pet.species})
      </h1>

      <p style={{ marginTop: 10 }}>{pet.description || "No description"}</p>

      {pet.location_text ? (
        <p style={{ marginTop: 10, color: "#555" }}>📌 {pet.location_text}</p>
      ) : null}

      <a
        href={pet.location_url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: 12,
          padding: "8px 12px",
          background: "#2563eb",
          color: "white",
          borderRadius: 8,
          textDecoration: "none",
        }}
      >
        📍 View on Google Maps
      </a>

      <p style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
        Status: {pet.status} • Posted: {new Date(pet.created_at).toLocaleString()}
      </p>

      <SaveButton petId={pet.id} />
    </main>
  );
}
