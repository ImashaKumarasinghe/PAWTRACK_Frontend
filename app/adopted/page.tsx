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
  adopted_at?: string | null;
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
  const pets = await getAdoptedPets();

  // ✅ same brown+white theme as home
  const COLORS = {
    bg: "#fbf7f2",
    card: "#ffffff",
    border: "#eadfce",
    text: "#2b1d14",
    subtext: "#6b4a2f",
    brown: "#6f3f22",
    brownDark: "#4b2a17",
    chipBg: "#f6efe6",
    chipBorder: "#eadfce",
    muted: "#8a6a52",
  };

  const chip = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 999,
    background: COLORS.chipBg,
    border: `1px solid ${COLORS.chipBorder}`,
    fontSize: 12,
    color: COLORS.brownDark,
    whiteSpace: "nowrap" as const,
  };

  return (
    <main
      style={{
        padding: 24,
        fontFamily: "Inter, Arial, sans-serif",
        background: COLORS.bg,
        minHeight: "100vh",
        color: COLORS.text,
      }}
    >
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 14 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: 0.2,
              color: COLORS.brownDark,
            }}
          >
            🏡 Adopted Pets
          </h1>

          <p style={{ marginTop: 8, color: COLORS.subtext, fontSize: 14 }}>
            These pets were successfully adopted through Pawtrack. Thank you for giving
            them a loving home!
          </p>
        </div>

        {/* Empty state */}
        {pets.length === 0 ? (
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <p style={{ fontSize: 16, color: COLORS.subtext, marginBottom: 6 }}>
              No adopted pets yet. 🐾
            </p>
            <p style={{ fontSize: 14, color: COLORS.muted }}>
              When someone adopts a pet, it will appear here.
            </p>
          </div>
        ) : (
          <ul
            style={{
              marginTop: 18,
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))", // ✅ 4 per row
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
                    background: COLORS.card,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 10px 24px rgba(43, 29, 20, 0.08)",
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
                            background: COLORS.chipBg,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: 190,
                            background: COLORS.chipBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: COLORS.muted,
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
                          left: 12,
                          top: 12,
                          padding: "7px 11px",
                          borderRadius: 999,
                          background: st.bg,
                          border: `1px solid ${st.border}`,
                          color: st.text,
                          fontSize: 12,
                          fontWeight: 800,
                          textTransform: "capitalize",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                        }}
                      >
                        {pet.status}
                      </div>
                    </div>

                    {/* details */}
                    <div style={{ padding: 14 }}>
                      <h2
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          margin: "0 0 8px 0",
                          lineHeight: 1.2,
                          color: COLORS.brownDark,
                        }}
                      >
                        {pet.title}
                      </h2>

                      {/* chips */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        <span style={chip}>🐾 {pet.species}</span>
                        <span style={chip}>📍 {pet.location_text || "Location"}</span>
                        <span style={chip}>
                          ✅ {new Date(pet.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: 13,
                          color: COLORS.subtext,
                          lineHeight: 1.45,
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
                  <div style={{ padding: 14, paddingTop: 0, marginTop: "auto" }}>
                    <a
                      href={pet.location_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "11px 12px",
                        borderRadius: 12,
                        border: `1px solid ${COLORS.border}`,
                        background: "#fff",
                        textDecoration: "none",
                        color: COLORS.brown,
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      📍 View on Google Maps
                    </a>

                    <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>
                      Posted: {new Date(pet.created_at).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* ✅ Responsive fix: if small screen, grid becomes 2 / 1 automatically */}
        <style>{`
          @media (max-width: 1100px) {
            ul { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          }
          @media (max-width: 850px) {
            ul { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          }
          @media (max-width: 520px) {
            ul { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </main>
  );
}
