import ArtworkCard from "./ArtworkCard";

function ArtworkList({ artworks, onDeleteArtwork, onEditArtwork, loading }) {
  if (loading) {
    return (
      <div className="empty-state">
        <p className="empty-state__message">Memuat karya seni dari server...</p>
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__message">Belum ada data karya seni</p>
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
          onEdit={onEditArtwork}
        />
      ))}
    </div>
  );
}

export default ArtworkList;
