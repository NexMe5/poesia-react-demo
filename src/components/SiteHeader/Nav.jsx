import { img } from '../../lib/assets';
import { NAV_LINKS } from '../../data/site';
import { useNavTone } from './useNavTone';
import './Nav.css';

/** Fixed header: brand, chapter links (wide screens), the "Contact us" button and the menu button. */
export default function Nav({ menuOpen, onToggleMenu }) {
  useNavTone();
  return (
    <header className="nav wrap">
      <a className="brand" href="#top" aria-label="Poesia, back to top">
        {/* header-sized copies (3× their 40 px / 30 px slots): the full artwork was 245 KB the loader waited for */}
        <img className="emb" src={img('nav-emblem.webp')} alt="" width="128" height="129" />
        <img className="wm wm-light" src={img('nav-wordmark-light.webp')} alt="Poesia" width="300" height="103" />
        <img className="wm wm-dark" src={img('nav-wordmark-dark.webp')} alt="" width="300" height="103" />
      </a>
      <nav className="nav-links" aria-label="Sections">
        {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>
      <div className="nav-end">
        <a className="nav-cta" href="#contact">Contact us</a>
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
