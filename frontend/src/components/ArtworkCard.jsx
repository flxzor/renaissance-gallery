import { useState } from "react";

function ArtworkCard({ artwork, onDelete, onEdit }) {
  const { id, title, artist, year, period, description, image, isMasterpiece } =
    artwork;
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = image && !imageFailed;

  return (
    <article className="card">
      <div className="card__media">
        {showImage ? (
          <img
            src={image}
            alt={`${title} oleh ${artist}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="card__fallback"
            role="img"
            aria-label={`Gambar ${title} tidak tersedia`}
          >
            <span>{title}</span>
            <small>Gambar tidak tersedia</small>
          </div>
        )}
      </div>

      <div className="card__body">
        <p className="card__period">
          {period} {isMasterpiece && "· ★ Masterpiece"}
        </p>
        <h3 className="card__title">{title}</h3>
        <p className="card__meta">
          {artist} · {year}
        </p>
        <p className="card__description">{description}</p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
          <button
            type="button"
            className="btn btn--text"
            onClick={() => onEdit(artwork)}
            aria-label={`Ubah ${title}`}
          >
            Ubah
          </button>
          <button
            type="button"
            className="btn btn--text"
            onClick={() => onDelete(id)}
            aria-label={`Hapus ${title} dari koleksi`}
          >
            Hapus
          </button>
        </div>
      </div>
    </article>
  );
}

export default ArtworkCard;
