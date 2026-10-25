import ArtworkCard from "./ArtworkCard";

function ArtworkList({ artworks, onDeleteArtwork, onRestore }) {
  if (artworks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__message">Belum ada data karya seni</p>
        <button type="button" className="btn btn--outline" onClick={onRestore}>
          Pulihkan Koleksi Contoh
        </button>
      </div>
    );
  }

  return (
    <div className="gallery-grid">
      {artworks.map((artwork) => (
        <ArtworkCard
          key={artwork.id}
          artwork={artwork}
          onDelete={onDeleteArtwork}
        />
      ))}
    </div>
  );
}

export default ArtworkList;