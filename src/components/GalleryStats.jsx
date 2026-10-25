function GalleryStats({ artworks }) {
  const totalArtworks = artworks.length;
  const totalArtists = new Set(
    artworks.map((artwork) => artwork.artist.trim().toLowerCase())
  ).size;
  const totalPeriods = new Set(
    artworks.map((artwork) => artwork.period.trim().toLowerCase())
  ).size;

  const stats = [
    { label: "Karya Seni", value: totalArtworks },
    { label: "Seniman", value: totalArtists },
    { label: "Periode", value: totalPeriods },
  ];

  return (
    <>
      <h2 className="visually-hidden">Statistik Koleksi</h2>
      <dl className="stats">
        {stats.map((stat) => (
          <div className="stats__item" key={stat.label}>
            <dt className="stats__label">{stat.label}</dt>
            <dd className="stats__value">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export default GalleryStats;