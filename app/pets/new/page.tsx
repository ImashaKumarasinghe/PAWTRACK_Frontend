"use client";

import { useState } from "react";

// ...existing code...

export default function AddPetPage() {
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Add this function to handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Add your form submission logic here
  };

  return (
    <div className="min-h-screen bg-[#f7f3ef] px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-6 shadow-lg ring-1 ring-[#e6ded6] sm:p-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#5b3d2b]">Report a Pet</h1>
          <p className="mt-1 text-sm text-[#7a5a44]">
            Share details to help others identify and assist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 🖼️ Photo Upload */}
          <div className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] p-4">
            <label className="mb-2 block text-sm font-semibold text-[#5b3d2b]">
              Pet Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full cursor-pointer rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] file:mr-4 file:rounded-md file:border-0 file:bg-[#7b4b2a] file:px-4 file:py-2 file:text-white hover:file:bg-[#6a4025]"
            />

            {photoPreview && (
              <div className="mt-4 space-y-2">
                <img
                  src={photoPreview}
                  alt="Pet preview"
                  className="max-h-72 w-full rounded-lg border border-[#eadfda] object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="rounded-md bg-[#b23b3b] px-3 py-2 text-sm font-medium text-white hover:bg-[#9f3434]"
                >
                  Remove Photo
                </button>
              </div>
            )}

            {uploadProgress && (
              <p className="mt-2 text-sm text-[#7b4b2a]">{uploadProgress}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[#5b3d2b]">
              Title
            </label>
            <input
              type="text"
              placeholder="Brown dog near bus stop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] focus:border-[#7b4b2a] focus:outline-none focus:ring-2 focus:ring-[#d7c2b3]"
            />
          </div>

          {/* Species */}
          <div>
            <label className="block text-sm font-semibold text-[#5b3d2b]">
              Species
            </label>
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] focus:border-[#7b4b2a] focus:outline-none focus:ring-2 focus:ring-[#d7c2b3]"
            >
              <option value="DOG">DOG</option>
              <option value="CAT">CAT</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#5b3d2b]">
              Description (optional)
            </label>
            <textarea
              placeholder="Friendly, looks hungry..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] focus:border-[#7b4b2a] focus:outline-none focus:ring-2 focus:ring-[#d7c2b3]"
            />
          </div>

          {/* Location */}
          <div className="rounded-xl border border-[#eadfda] bg-[#fcfaf8] p-4">
            <p className="text-sm font-semibold text-[#5b3d2b]">📍 Location</p>
            <p className="mt-1 text-xs text-[#7a5a44]">
              Tip: Open Google Maps → right-click the location → copy the link → paste here.
            </p>

            <input
              type="text"
              placeholder="Google Maps link (required)"
              value={locationUrl}
              onChange={(e) => setLocationUrl(e.target.value)}
              className="mt-3 w-full rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] focus:border-[#7b4b2a] focus:outline-none focus:ring-2 focus:ring-[#d7c2b3]"
            />

            <input
              type="text"
              placeholder="Short location note (optional) e.g. Near bus stop"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="mt-2 w-full rounded-lg border border-[#e2d6cf] bg-white px-3 py-2 text-sm text-[#5b3d2b] focus:border-[#7b4b2a] focus:outline-none focus:ring-2 focus:ring-[#d7c2b3]"
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

          {/* Error */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#7b4b2a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#6a4025] disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}