import AdoptedPetCard from "@/components/AdoptedPetCard";

type Pet = {
  id: number;
  title: string;
  species: string;
  description?: string | null;
  location_url: string;
  location_text?: string | null;
  photo_url?: string | null;
  status: string;
  created_at: string;
};

async function getAdoptedPets(): Promise<Pet[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/pets?status=ADOPTED`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AdoptedPage() {
  const adoptedPets = await getAdoptedPets();

  return (
    <main style={{ padding: 24, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold", color: "#7b4a12", marginBottom: 8 }}>
        🏡 Adopted Pets
      </h1>
      <p style={{ marginBottom: 20, color: "#666" }}>
        All previously adopted pets
      </p>

      {adoptedPets.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <p style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>
            No adopted pets yet. 🐾
          </p>
          <p style={{ fontSize: 14, color: "#999" }}>
            Check back later to see happy adoption stories!
          </p>
        </div>
      ) : (
        <div className="pet-grid" style={{ marginTop: 20 }}>
          {adoptedPets.map((pet) => (
            <AdoptedPetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </main>
  );
}
