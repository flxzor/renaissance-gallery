import { useEffect, useRef, useState } from "react";

const emptyForm = {
  title: "",
  artist: "",
  year: "",
  period: "",
  description: "",
  image: "",
};

const PERIOD_OPTIONS = [
  "Renaissance Awal",
  "Renaissance Tinggi",
  "Manierisme",
  "Renaissance Utara",
];

const validate = (values) => {
  const errors = {};
  if (!values.title.trim()) errors.title = "Judul karya wajib diisi.";
  if (!values.artist.trim()) errors.artist = "Nama seniman wajib diisi.";
  if (!values.year.trim())
    errors.year = "Tahun atau masa pembuatan wajib diisi.";
  if (!values.period.trim()) errors.period = "Periode seni wajib diisi.";
  if (values.description.trim().length < 10)
    errors.description = "Deskripsi wajib diisi (minimal 10 karakter).";
  if (values.image.trim() && !/^https?:\/\/\S+$/i.test(values.image.trim()))
    errors.image = "URL gambar harus diawali http:// atau https://.";
  return errors;
};

function Field({ id, label, error, full = false, children }) {
  return (
    <div className={`field${full ? " field--full" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function ArtworkForm({ onAddArtwork, onClose }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const panelRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;
    onAddArtwork(values);
    setValues(emptyForm);
    setErrors({});
  };

  const aria = (name) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="form-panel" ref={panelRef}>
      <div className="section-head">
        <p className="kicker">Koleksi Baru</p>
        <h2>Tambah Karya Baru</h2>
      </div>
      <p className="form-panel__intro">
        Isi data lukisan yang ingin kamu masukkan. Karya akan langsung muncul di
        galeri.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <Field id="title" label="Judul Karya" error={errors.title}>
            <input
              id="title"
              name="title"
              type="text"
              ref={titleRef}
              value={values.title}
              onChange={handleChange}
              placeholder="mis. Annunciation"
              autoComplete="off"
              required
              {...aria("title")}
            />
          </Field>

          <Field id="artist" label="Seniman" error={errors.artist}>
            <input
              id="artist"
              name="artist"
              type="text"
              value={values.artist}
              onChange={handleChange}
              placeholder="mis. Leonardo da Vinci"
              autoComplete="off"
              required
              {...aria("artist")}
            />
          </Field>

          <Field id="year" label="Tahun / Masa" error={errors.year}>
            <input
              id="year"
              name="year"
              type="text"
              value={values.year}
              onChange={handleChange}
              placeholder="mis. c. 1472–1475"
              autoComplete="off"
              required
              {...aria("year")}
            />
          </Field>

          <Field id="period" label="Periode Seni" error={errors.period}>
            <input
              id="period"
              name="period"
              type="text"
              list="period-options"
              value={values.period}
              onChange={handleChange}
              placeholder="Pilih atau ketik periode"
              autoComplete="off"
              required
              {...aria("period")}
            />
            <datalist id="period-options">
              {PERIOD_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </Field>

          <Field
            id="image"
            label="URL Gambar (opsional)"
            error={errors.image}
            full
          >
            <input
              id="image"
              name="image"
              type="url"
              value={values.image}
              onChange={handleChange}
              placeholder="https://..."
              autoComplete="off"
              {...aria("image")}
            />
          </Field>

          <Field
            id="description"
            label="Deskripsi"
            error={errors.description}
            full
          >
            <textarea
              id="description"
              name="description"
              rows="4"
              value={values.description}
              onChange={handleChange}
              placeholder="Ceritakan secara singkat subjek atau arti penting karya ini."
              required
              {...aria("description")}
            />
          </Field>
        </div>

        {hasErrors && (
          <p className="form-alert" role="alert">
            Periksa kembali isian yang ditandai sebelum menyimpan.
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            Tambah Karya
          </button>
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArtworkForm;