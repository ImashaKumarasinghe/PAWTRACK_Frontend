import Link from "next/link";

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

async function getPets(): Promise<Pet[]> {
  const res = await fetch("http://127.0.0.1:8000/pets", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch pets");
  }

  return res.json();
}

function statusStyle(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("adopt"))
    return { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46" };
  if (s.includes("found"))
    return { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" };
  if (s.includes("lost"))
    return { bg: "#fff7ed", border: "#fed7aa", text: "#9a3412" };
  if (s.includes("injur"))
    return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" };

  return { bg: "#f3f4f6", border: "#e5e7eb", text: "#374151" };
}

export default async function Home() {
  const pets = await getPets();

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    fontSize: 12,
    color: "#111827",
    whiteSpace: "nowrap" as const,
  };

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "Arial",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
       
        <h1 style={{ marginTop: 8, color: "#4b5563" }}>
          Available pets reported on the street
        </h1>

        {pets.length === 0 ? (
          <p style={{ marginTop: 20 }}>No pets available right now.</p>
        ) : (
          <ul
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
              listStyle: "none",
              padding: 0,
            }}
          >
            {pets.map((pet) => {
              const st = statusStyle(pet.status);

              return (
                <li
                  key={pet.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link
                    href={`/pets/${pet.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {/* image */}
                    <div style={{ position: "relative" }}>
                      {pet.photo_url ? (
                        <img
                          src={pet.photo_url}
                          alt={pet.title}
                          style={{
                            width: "100%",
                            height: 190,
                            objectFit: "cover",
                            display: "block",
                            background: "#f3f4f6",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: 190,
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: 14,
                          }}
                        >
                          No photo
                        </div>
                      )}

                      {/* status badge */}
                      <div
                        style={{
                          position: "absolute",
                          left: 10,
                          top: 10,
                          padding: "6px 10px",
                          borderRadius: 999,
                          background: st.bg,
                          border: `1px solid ${st.border}`,
                          color: st.text,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}
                      >
                        {pet.status || "status"}
                      </div>
                    </div>

                    {/* details */}
                    <div style={{ padding: 12 }}>
                      <h2
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          margin: "0 0 8px 0",
                          lineHeight: 1.2,
                        }}
                      >
                        {pet.title}
                      </h2>

                      {/* tags/chips */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        <span style={chip}>🐾 {pet.species}</span>
                        <span style={chip}>
                          📍 {pet.location_text || "Location"}
                        </span>
                        <span style={chip}>
                          🕒 {new Date(pet.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p
                        style={{
                          marginTop: 10,
                          marginBottom: 0,
                          fontSize: 13,
                          color: "#4b5563",
                          lineHeight: 1.35,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {pet.description || "No description"}
                      </p>
                    </div>
                  </Link>

                  {/* bottom action */}
                  <div style={{ padding: 12, paddingTop: 0, marginTop: "auto" }}>
                    <a
                      href={pet.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        width: "100%",
                        justifyContent: "center",
                        padding: "10px 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        textDecoration: "none",
                        color: "#111827",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      📍 View on Google Maps
                    </a>

                    <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                      Posted: {new Date(pet.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Floating add button (unchanged) */}
      <Link href="/pets/new">
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            backgroundColor: "#2563eb",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          }}
          title="Add Pet"
        >
          +
        </div>
      </Link>
    </main>
  );
}
