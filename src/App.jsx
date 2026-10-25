import { useEffect, useState } from "react";
import Header from "./components/Header";
import GalleryStats from "./components/GalleryStats";
import ArtworkList from "./components/ArtworkList";
import ArtworkForm from "./components/ArtworkForm";
import { initialArtworks } from "./data/artworks";

const createId = () =>
  `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function App() {
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const handleAddArtwork = (data) => {
    const newArtwork = {
      id: createId(),
      title: data.title.trim(),
      artist: data.artist.trim(),
      year: data.year.trim(),
      period: data.period.trim(),
      description: data.description.trim(),
      image: data.image.trim(),
    };

    setArtworks((current) => [newArtwork, ...current]);
    setNotice(`“${newArtwork.title}” berhasil ditambahkan ke koleksi.`);
    setIsFormOpen(false);
  };

  const handleDeleteArtwork = (id) => {
    setArtworks((current) => current.filter((artwork) => artwork.id !== id));
  };

  const handleRestore = () => setArtworks(initialArtworks);

  return (
    <>
      <a className="skip-link" href="#koleksi">
        Lewati ke koleksi
      </a>

      <Header onOpenForm={() => setIsFormOpen(true)} />

      <main>
        <section className="hero">
          <div className="container hero__inner">
            <p className="kicker">Katalog Digital · Abad XV–XVI</p>
            <h1>
              Renaissance <em>Gallery</em>
            </h1>
            <p className="hero__lead">
              Jelajahi lukisan-lukisan agung dari Florence, Roma, dan Milan,
              lalu perluas koleksi ini dengan karya pilihanmu sendiri.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#koleksi">
                Jelajahi Koleksi
              </a>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => setIsFormOpen(true)}
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
              onAddArtwork={handleAddArtwork}
              onClose={() => setIsFormOpen(false)}
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
            onDeleteArtwork={handleDeleteArtwork}
            onRestore={handleRestore}
          />
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>Renaissance Gallery · Tugas BAB 6 React Dasar</p>
          <p>Gambar contoh bersumber dari Wikimedia Commons.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
