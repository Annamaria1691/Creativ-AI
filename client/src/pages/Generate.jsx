// src/pages/Generate.jsx
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function Generate() {
  const { token } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Funcție reutilizată pentru descărcare imagine
  const downloadImage = async (url, filename = "image") => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${filename}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      alert("Descărcarea a eșuat. Te rog încearcă din nou.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImageUrl("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/images/generate",
        { prompt, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setImageUrl(data.imageUrl);
    } catch {
      setError("Eroare la generarea imaginii.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="mb-5 text-center">Generează o imagine AI</h2>
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="mb-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              placeholder="Titlu imagine"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="form-control"
              rows="3"
              placeholder="Scrie promptul pentru imagine ca de exemplu: A red fox in an enchanted forest with glowing mushrooms and autumn leaves, digital art, vibrant colors, serene and mysterious atmosphere "
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !prompt}
          >
            {loading ? "Se generează..." : "Generează imagine"}
          </button>
        </form>

        {error && <p className="text-danger text-center">{error}</p>}

        {imageUrl && (
          <div className="text-center">
            <h5 className="mb-3">Imagine generată:</h5>
            <img
              src={imageUrl}
              alt={title || "Generated AI"}
              className="img-fluid rounded shadow mb-3"
              style={{ maxHeight: "500px" }}
            />
            <div>
              <button
                className="btn btn-success"
                onClick={() => downloadImage(imageUrl, title || "image")}
              >
                Descarcă imaginea
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
