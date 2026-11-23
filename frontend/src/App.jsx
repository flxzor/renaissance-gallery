import { useEffect, useState } from "react";
import Header from "./components/Header";
import GalleryStats from "./components/GalleryStats";
import ArtworkList from "./components/ArtworkList";
import ArtworkForm from "./components/ArtworkForm";

const API_URL = "http://localhost:3000/artworks";

function App() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [notice, setNotice] = useState("");
  const [serverError, setServerError] = useState("");

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Gagal mengambil data karya seni dari backend");
      }
      const data = await response.json();
      setArtworks(data);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleFormSubmit = async (values, id) => {
    setServerError("");
    const payload = {
      title: values.title.trim(),
      artist: values.artist.trim(),
      year: Number(values.year),
      period: values.period.trim(),
      description: values.description.trim(),
      image: values.image.trim() || undefined,
      isMasterpiece: Boolean(values.isMasterpiece),
    };

    try {
      if (id) {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok) {
          const msg = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Gagal memperbarui karya seni";
          setServerError(msg);
          return;
        }

        setArtworks((current) =>
          current.map((item) => (item.id === id ? result : item)),
        );
        setNotice(`“${result.title}” berhasil diperbarui.`);
      } else {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok) {
          const msg = Array.isArray(result.message)
            ? result.message.join(", ")
            : result.message || "Gagal menambahkan karya seni";
          setServerError(msg);
          return;
        }

        setArtworks((current) => [result, ...current]);
        setNotice(`“${result.title}” berhasil ditambahkan ke koleksi.`);
      }

      setIsFormOpen(false);
      setEditingArtwork(null);
      setServerError("");
    } catch (err) {
      setServerError(err.message);
    }
  };

  const handleDeleteArtwork = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setServerError(result.message || "Gagal menghapus karya seni");
        return;
      }

      setArtworks((current) => current.filter((artwork) => artwork.id !== id));
      setNotice(result.message || "Karya seni berhasil dihapus.");
    } catch (err) {
      setServerError(err.message);
    }
  };

  const handleOpenCreate = () => {
    setEditingArtwork(null);
    setServerError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (artwork) => {
    setEditingArtwork(artwork);
    setServerError("");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingArtwork(null);
    setServerError("");
  };

  return (
    <>
      <a className="skip-link" href="#koleksi">
        Lewati ke koleksi
      </a>

      <Header onOpenForm={handleOpenCreate} />

      <main>
        <section className="hero">
          <div className="container hero__inner">
            <p className="kicker">Katalog Digital · Abad XV–XVI</p>
            <h1>
              Renaissance <em>Gallery</em>
            </h1>
            <p className="hero__lead">
              Jelajahi lukisan-lukisan agung dari Florence, Roma, dan Milan,
              lalu kelola koleksi ini dengan backend NestJS dan frontend React.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#koleksi">
                Jelajahi Koleksi
              </a>
              <button
                type="button"
                className="btn btn--outline"
                onClick={handleOpenCreate}
              >
                Tambah Koleksi
              </button>
            </div>
          </div>
        </section>

        <section id="statistik" className="section container">
          <GalleryStats artworks={artworks} />
        </section>

        {isFormOpen && (
          <section id="tambah" className="section container">
            <ArtworkForm
              initialData={editingArtwork}
              onSubmit={handleFormSubmit}
              onClose={handleCloseForm}
              serverError={serverError}
            />
          </section>
        )}

        <section id="koleksi" className="section container">
          <div className="section-head">
            <p className="kicker">Koleksi</p>
            <h2>Karya Seni</h2>
          </div>

          <div className="notice-slot" role="status">
            {notice && <p className="notice">{notice}</p>}
          </div>

          <ArtworkList
            artworks={artworks}
            loading={loading}
            onDeleteArtwork={handleDeleteArtwork}
            onEditArtwork={handleOpenEdit}
          />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Renaissance Gallery · Tugas BAB 9 NestJS MVC & Fullstack</p>
          <p>Gambar contoh bersumber dari Wikimedia Commons.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
