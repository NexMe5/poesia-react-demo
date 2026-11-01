import { img } from '../../lib/assets';
import { NAV_LINKS } from '../../data/site';
import { useNavTone } from './useNavTone';
import './Nav.css';

/** Fixed header: brand, chapter links (wide screens), the partnership CTA and the menu button. */
export default function Nav({ menuOpen, onToggleMenu }) {
  useNavTone();
  return (
    <header className="nav wrap">
      <a className="brand" href="#top" aria-label="Poesia, back to top">
        <img className="emb" src={img('emblem.webp')} alt="" width="515" height="520" />
        <img className="wm wm-light" src={img('wordmark-light.png')} alt="Poesia" width="900" height="309" />
        <img className="wm wm-dark" src={img('wordmark-dark.png')} alt="" width="900" height="309" />
      </a>
      <nav className="nav-links" aria-label="Sections">
        {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <div className="nav-end">
        <a className="nav-cta" href="#contact">Partner with us</a>
        <button
          className="nav-menu"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={onToggleMenu}
        >
          <span>Menu</span><i aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
