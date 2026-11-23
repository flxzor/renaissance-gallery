import { useState } from "react";

function Header({ onOpenForm }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const handleOpenForm = () => {
    onOpenForm();
    closeMenu();
  };

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="wordmark" href="#" aria-label="Renaissance Gallery, kembali ke atas">
          Renaissance <em>Gallery</em>
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Tutup" : "Menu"}
        </button>

        <nav
          id="main-nav"
          className={`site-nav${menuOpen ? " is-open" : ""}`}
          aria-label="Navigasi utama"
        >
          <ul>
            <li>
              <a href="#koleksi" onClick={closeMenu}>
                Koleksi
              </a>
            </li>
            <li>
              <a href="#statistik" onClick={closeMenu}>
                Statistik
              </a>
            </li>
            <li>
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={handleOpenForm}
              >
                Tambah Koleksi
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;