import { useEffect, useRef, useState } from "react";

const emptyForm = {
  title: "",
  artist: "",
  year: "",
  period: "Renaissance Tinggi",
  description: "",
  image: "",
  isMasterpiece: false,
};

const PERIOD_OPTIONS = [
  "Renaissance Awal",
  "Renaissance Tinggi",
  "Manierisme",
  "Renaissance Utara",
];

const validate = (values) => {
  const errors = {};
  if (!values.title.trim() || values.title.trim().length < 3) {
    errors.title = "Judul karya minimal 3 karakter.";
  }
  if (!values.artist.trim() || values.artist.trim().length < 2) {
    errors.artist = "Nama seniman minimal 2 karakter.";
  }
  const yearNum = Number(values.year);
  if (!values.year || isNaN(yearNum) || yearNum < 1200 || yearNum > 2100) {
    errors.year = "Tahun harus berupa angka antara 1200 dan 2100.";
  }
  if (!PERIOD_OPTIONS.includes(values.period)) {
    errors.period = "Pilih salah satu periode seni yang valid.";
  }
  if (values.description.trim().length < 10) {
    errors.description = "Deskripsi wajib diisi (minimal 10 karakter).";
  }
  if (values.image.trim() && !/^https?:\/\/\S+$/i.test(values.image.trim())) {
    errors.image = "URL gambar harus diawali http:// atau https://.";
  }
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

function ArtworkForm({ initialData, onSubmit, onClose, serverError }) {
  const [values, setValues] = useState(
    initialData
      ? {
          title: initialData.title || "",
          artist: initialData.artist || "",
          year: initialData.year ? String(initialData.year) : "",
          period: initialData.period || "Renaissance Tinggi",
          description: initialData.description || "",
          image: initialData.image || "",
          isMasterpiece: Boolean(initialData.isMasterpiece),
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});
  const panelRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const foundErrors = validate(values);
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length > 0) return;
    onSubmit(values, initialData?.id);
  };

  const aria = (name) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <div className="form-panel" ref={panelRef}>
      <div className="section-head">
        <p className="kicker">
          {initialData ? "Sunting Koleksi" : "Koleksi Baru"}
        </p>
        <h2>{initialData ? "Ubah Karya Seni" : "Tambah Karya Baru"}</h2>
      </div>
      <p className="form-panel__intro">
        {initialData
          ? "Perbarui rincian karya seni berikut."
          : "Isi data lukisan yang ingin kamu masukkan. Data akan langsung tersimpan di backend NestJS."}
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

          <Field id="year" label="Tahun Pembuatan" error={errors.year}>
            <input
              id="year"
              name="year"
              type="number"
              value={values.year}
              onChange={handleChange}
              placeholder="mis. 1503"
              autoComplete="off"
              required
              {...aria("year")}
            />
          </Field>

          <Field id="period" label="Periode Seni" error={errors.period}>
            <select
              id="period"
              name="period"
              value={values.period}
              onChange={handleChange}
              required
              {...aria("period")}
            >
              {PERIOD_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              placeholder="Ceritakan secara singkat subjek atau arti penting karya ini (minimal 10 karakter)."
              required
              {...aria("description")}
            />
          </Field>

          <div className="field field--full">
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="isMasterpiece"
                checked={values.isMasterpiece}
                onChange={handleChange}
              />
              Tandai sebagai Karya Utama (Masterpiece)
            </label>
          </div>
        </div>

        {serverError && (
          <p className="form-alert" role="alert">
            {serverError}
          </p>
        )}

        {hasErrors && (
          <p className="form-alert" role="alert">
            Periksa kembali isian yang ditandai sebelum menyimpan.
          </p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            {initialData ? "Simpan Perubahan" : "Tambah Karya"}
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
