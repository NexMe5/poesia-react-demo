import Leaves from '../Leaves/Leaves';
import ArrowIcon from '../icons/ArrowIcon';
import { MENU_LINKS, MENU_FOOT } from '../../data/site';
import { navigateTo } from '../../navigation/useInPageNavigation';
import { cx } from '../../lib/dom';
import './Menu.css';

/** Full-screen menu for screens without the inline links. */
export default function Menu({ open, onClose }) {
  const go = (e, href) => {
    e.preventDefault();
    onClose();
    // the page is scroll-locked while the menu is open: jump once the lock has lifted
    requestAnimationFrame(() => navigateTo(href));
  };

  return (
    <div className={cx('menu', open && 'open')} id="menu" inert={!open}>
      <Leaves variant="cl-a" />
      <Leaves variant="cl-b" />
      <nav className="menu-links" aria-label="Sections">
        {MENU_LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
            <span>{l.label}{l.accent && <> <em>{l.accent}</em></>}</span>
            <i className="m-arrow"><ArrowIcon /></i>
          </a>
        ))}
      </nav>
      <div className="menu-foot">
        {MENU_FOOT.map((l) => (
          <a key={l.label} href={l.href} onClick={onClose} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
