"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/lib/supabase";

export default function AddPetPage() {
  const router = useRouter();

  // 🔹 Pet fields
  const [title, setTitle] = useState("");
  const [species, setSpecies] = useState("DOG");
  const [description, setDescription] = useState("");
  
  // 🖼️ Photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");

  // 🔹 Location fields
  const [locationUrl, setLocationUrl] = useState("");
  const [locationText, setLocationText] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validation
    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!locationUrl.trim()) {
      setError("Please paste a Google Maps location link.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      let photoUrl = null;
      
      // Upload photo to Supabase if provided
      if (photoFile) {
        setUploadProgress("Uploading photo...");
        try {
          photoUrl = await uploadFile('paw photos', photoFile);
          setUploadProgress("Photo uploaded successfully!");
        } catch (uploadErr: any) {
          throw new Error(`Photo upload failed: ${uploadErr.message}`);
        }
      }

      // ✅ Send to backend
      setUploadProgress("Saving pet details...");
      const res = await fetch("http://127.0.0.1:9000/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          species,
          description: description.trim() || null,
          location_url: locationUrl.trim(),
          location_text: locationText.trim() || null,
          photo_url: photoUrl, // Add photo URL to the payload
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to create pet");
      }

      await res.json();

      // ✅ Go back to home page so you can see the new pet
      setUploadProgress("Success!");
      router.push("/");
      // Optional: force refresh data if needed
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Add Pet Page</h1>
      <p>This page will contain the pet form.</p>

      <form onSubmit={handleSubmit}>
        {/* �️ Photo Upload */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
            Pet Photo
          </label>
          
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ 
              width: "100%", 
              padding: 10, 
              border: "1px solid #ccc",
              borderRadius: 4
            }}
          />
          
          {photoPreview && (
            <div style={{ marginTop: 12 }}>
              <img
                src={photoPreview}
                alt="Pet preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  borderRadius: 8,
                  objectFit: "contain",
                  border: "2px solid #e5e7eb"
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setPhotoFile(null);
                  setPhotoPreview(null);
                }}
                style={{
                  marginTop: 8,
                  padding: "6px 12px",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Remove Photo
              </button>
            </div>
          )}
          
          {uploadProgress && (
            <p style={{ color: "#2563eb", marginTop: 8, fontSize: 14 }}>
              {uploadProgress}
            </p>
          )}
        </div>

        {/* �🐾 Title */}
        <label style={{ fontWeight: "bold" }}>Title</label>
        <input
          type="text"
          placeholder="Brown dog near bus stop"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />

        {/* 🐶 Species */}
        <label style={{ fontWeight: "bold", marginTop: 16, display: "block" }}>
          Species
        </label>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        >
          <option value="DOG">DOG</option>
          <option value="CAT">CAT</option>
        </select>

        {/* 📝 Description */}
        <label style={{ fontWeight: "bold", marginTop: 16, display: "block" }}>
          Description (optional)
        </label>
        <textarea
          placeholder="Friendly, looks hungry..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 10, marginTop: 6 }}
        />

        {/* 📍 Location */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontWeight: "bold" }}>📍 Location</p>
          <p style={{ fontSize: 12, color: "#555" }}>
            Tip: Open Google Maps → right-click the location → copy the link → paste here.
          </p>

          <input
            type="text"
            placeholder="Google Maps link (required)"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 6 }}
          />

          <input
            type="text"
            placeholder="Short location note (optional) e.g. Near bus stop"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 8 }}
          />
        </div>

        {/* Preview */}
        {locationUrl && (
          <a
            href={locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 12,
              padding: "8px 12px",
              background: "#2563eb",
              color: "white",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            📍 View on Google Maps
          </a>
        )}

        {/* Error */}
        {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
