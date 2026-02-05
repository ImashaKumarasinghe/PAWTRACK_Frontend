"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/supabase"; // 👈 your supabase helper

export default function AddPetPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState("DOG");
  const [description, setDescription] = useState("");
  const [locationUrl, setLocationUrl] = useState("");
  const [locationText, setLocationText] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 📸 Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ FULL submit logic (UNCHANGED)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setUploadProgress("");

    // 🔍 Basic validation
    if (!title.trim()) return setError("Title is required.");
    if (!locationUrl.trim()) return setError("Google Maps link is required.");
    if (!photoFile) return setError("Please upload a pet photo.");

    // 🔐 Check login
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first to report a pet.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Upload photo to Supabase
      setUploadProgress("Uploading photo...");
      const photoUrl = await uploadFile("paw photos", photoFile);

      // 2️⃣ Send pet data to backend
      setUploadProgress("Saving pet details...");

      const payload = {
        title,
        species,
        description: description || null,
        location_url: locationUrl,
        location_text: locationText || null,
        photo_url: photoUrl,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = "Failed to submit pet";
        try {
          const data = await res.json();
          msg = data?.detail || JSON.stringify(data);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      // 3️⃣ Success → redirect
      setUploadProgress("✅ Pet submitted successfully!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      setUploadProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ef] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#e6ded6] sm:p-10">
        <h1 className="text-2xl font-semibold text-[#5b3d2b]">Report a Pet</h1>
        <p className="mt-1 text-sm text-[#7a5a44]">
          Share details to help others identify and assist 🐶
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* 🖼️ Pet Photo */}
          <div className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] p-4">
            <label
              htmlFor="photo"
              className="block text-sm font-semibold text-[#5b3d2b]"
            >
              Pet Photo <span className="text-red-600">*</span>
            </label>

            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="mt-2 block w-full cursor-pointer rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm file:bg-[#7b4b2a] file:text-white file:border-0 file:rounded-md file:px-4 file:py-2"
            />

            {photoPreview && (
              <div className="mt-4">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="max-h-72 w-full rounded-lg object-contain border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white"
                >
                  Remove photo
                </button>
              </div>
            )}
          </div>

          {/* 🏷️ Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-[#5b3d2b]"
            >
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              name="title"
              required
              placeholder="Brown dog near bus stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] px-3 py-2"
            />
          </div>

          {/* 🐾 Species */}
          <div>
            <label
              htmlFor="species"
              className="block text-sm font-semibold text-[#5b3d2b]"
            >
              Species <span className="text-red-600">*</span>
            </label>
            <select
              id="species"
              name="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] px-3 py-2"
            >
              <option value="DOG">DOG</option>
              <option value="CAT">CAT</option>
            </select>
          </div>

          {/* 📝 Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-[#5b3d2b]"
            >
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Friendly, looks hungry..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] px-3 py-2"
            />
          </div>

          {/* 📍 Location */}
          <div className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] p-4">
            <p className="text-sm font-semibold text-[#5b3d2b]">📍 Location</p>
            <p className="mt-1 text-xs text-[#7a5a44]">
              Tip: Google Maps → copy link → paste here.
            </p>

            <label
              htmlFor="location_url"
              className="mt-3 block text-sm font-semibold text-[#5b3d2b]"
            >
              Google Maps Link <span className="text-red-600">*</span>
            </label>
            <input
              id="location_url"
              name="location_url"
              required
              placeholder="https://maps.google.com/..."
              value={locationUrl}
              onChange={(e) => setLocationUrl(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] px-3 py-2"
            />

            <label
              htmlFor="location_text"
              className="mt-3 block text-sm font-semibold text-[#5b3d2b]"
            >
              Location Note (optional)
            </label>
            <input
              id="location_text"
              name="location_text"
              placeholder="Near bus stop"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] px-3 py-2"
            />

            {locationUrl && (
              <a
                href={locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center rounded-md bg-[#7b4b2a] px-3 py-2 text-sm font-medium text-white hover:bg-[#6a4025]"
              >
                📍 View on Google Maps
              </a>
            )}
          </div>

          {uploadProgress && (
            <p className="text-sm text-[#7b4b2a]">{uploadProgress}</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#7b4b2a] px-4 py-3 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
