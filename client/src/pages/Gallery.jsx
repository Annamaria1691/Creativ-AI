import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import "./Gallery.css";

export default function Gallery() {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch gallery on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/images", {
          baseURL: "http://localhost:5000",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(data.images)) {
          throw new Error("Răspuns invalid de la server");
        }
        setImages(data.images);
      } catch {
        setError("Nu s-au putut încărca imaginile. Încearcă mai târziu.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  // Download image helper
  const downloadImage = async (url, title = "image") => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${title}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Descărcarea a eșuat. Încearcă din nou.");
    }
  };

  // Actual deletion
  const deleteImage = async (id) => {
    try {
      await axios.delete(`/api/images/${id}`, {
        baseURL: "http://localhost:5000",
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages((imgs) => imgs.filter((img) => img._id !== id));
      setSelectedImage(null);
      toast.success("Imagine ștearsă cu succes");
    } catch {
      toast.error("Ștergerea a eșuat. Încearcă din nou.");
    }
  };

  // Custom toast confirmation
  const confirmDelete = (id) => {
    toast.warn(
      ({ closeToast }) => (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <span>Sigur vrei să ștergi această imagine?</span>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.5rem",
            }}
          >
            <button
              onClick={() => {
                deleteImage(id);
                closeToast();
              }}
              className="btn btn-sm btn-danger"
            >
              Da
            </button>
            <button
              onClick={() => closeToast()}
              className="btn btn-sm btn-secondary"
            >
              Nu
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <Layout>
      <div className="container py-5">
        <h2 className="text-center mb-5">
          {loading
            ? "Se încarcă galeria…"
            : error
            ? ""
            : images.length
            ? "Galeria ta de imagini"
            : "Nu ai generat nicio imagine!"}
        </h2>

        {error && <p className="text-danger text-center mb-4">{error}</p>}

        {!loading && !error && images.length > 0 && (
          <div className="row g-4">
            {images.map((img) => (
              <div className="col-sm-6 col-md-4 col-lg-3" key={img._id}>
                <div
                  className="card gallery-card"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.title || "Fără titlu"}
                    className="card-img-top"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="card-body text-center">
                    {img.title || "Fără titlu"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title || ""}
                className="modal-image"
              />
              <div className="modal-details">
                <h3>{selectedImage.title || "Fără titlu"}</h3>
                <p>
                  <strong>Prompt:</strong> {selectedImage.prompt || "–"}
                </p>
                <div className="d-flex justify-content-center gap-2 mt-3">
                  <button
                    className="btn btn-success"
                    onClick={() =>
                      downloadImage(selectedImage.imageUrl, selectedImage.title)
                    }
                  >
                    Descarcă
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(selectedImage._id)}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
