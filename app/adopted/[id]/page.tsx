"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Pet = {
  id: number;
  title: string;
  species: string;
  description?: string;
  photo_url: string;
  location_url: string;
  location_text?: string;
  status: string;
  created_at: string;
};

export default function AdoptedPage() {
  const params = useParams();
  const id = params.id as string;

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPet() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets/${id}`);
      const data = await res.json();
      setPet(data);
      setLoading(false);
    }

    loadPet();
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading adopted pet...</p>;
  if (!pet) return <p style={{ padding: 20 }}>Pet not found</p>;

  return (
    <main style={{ maxWidth: 700, margin: "30px auto", padding: 16 }}>
       <h1>Adopted Pets</h1>
      <p>Here you will show the adopted pets list (next step).</p>

      <img
        src={pet.photo_url}
        alt={pet.title}
        style={{ width: "100%", borderRadius: 12, marginTop: 16 }}
      />

      <h2 style={{ marginTop: 16 }}>{pet.title}</h2>
      <p><b>Species:</b> {pet.species}</p>
      <p><b>Status:</b> {pet.status}</p>
      {pet.description && <p><b>Description:</b> {pet.description}</p>}
      {pet.location_text && <p><b>Location:</b> {pet.location_text}</p>}

      <a href={pet.location_url} target="_blank" rel="noreferrer">
        📍 Open location in Google Maps
      </a>
    </main>
  );
}
