type Pet = {
  id: number;
  title: string;
  species: string;
  description?: string | null;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
};

async function getPets(): Promise<Pet[]> {
  const res = await fetch("http://127.0.0.1:9000/pets", {
    cache: "no-store", // always get latest data, no caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }

  return res.json();
}

export default async function Home() {
  const pets = await getPets();

  return (
    <main style={{ padding: 24, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>🐾 PawTrack</h1>
      <p>Available pets reported on the street</p>

      {pets.length === 0 ? (
        <p style={{ marginTop: 20 }}>No pets available right now.</p>
      ) : (
        <ul style={{ marginTop: 20 }}>
          {pets.map((pet) => (
            <li
              key={pet.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 12,
                borderRadius: 8,
              }}
            >
              <h2 style={{ fontSize: 18, fontWeight: "bold" }}>
                {pet.title} ({pet.species})
              </h2>
              <p>{pet.description || "No description"}</p>

              <p style={{ fontSize: 12, color: "#555" }}>
                Location: {pet.latitude}, {pet.longitude}
              </p>

              <p style={{ fontSize: 12, color: "#555" }}>
                Posted: {new Date(pet.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
