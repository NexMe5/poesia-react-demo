import { img } from '../../lib/assets';
import { BLENDS } from '../../data/blends';
import { CONTACT, COPYRIGHT_YEAR, FOOTER_CONTACT, FOOTER_EXPLORE, LEGAL_LINKS } from '../../data/site';
import { Link } from '../../router/Router';
import './Footer.css';

const external = (l) => (l.external ? { target: '_blank', rel: 'noopener' } : {});

/** On the story, chapter links are plain anchors (the scroll engine lands them); from other pages they route home. */
function PageLink({ base, to, ...rest }) {
  return base ? <Link to={base + to} {...rest} /> : <a href={to} {...rest} />;
}

/**
 * Site footer: brand, every chapter, every blend (each opens its own shot), the contact lines and the legal pages.
 * `base` is '' on the story page (links jump within it) and '/' on other pages (links open the story at that chapter).
 */
export default function Footer({ base = '' }) {
  const onStory = base === '';
  return (
    <footer className="foot wrap">
      <div className="foot-grid">
        <div className="foot-brand">
          <PageLink base={base} className="foot-logo" to={onStory ? '#top' : ''} aria-label="Poesia, back to the beginning">
            <img src={img('emblem.webp')} alt="" width="515" height="520" />
            <img src={img('wordmark-light.png')} alt="Poesia" width="900" height="309" />
          </PageLink>
          <p className="foot-tag">Where every cup tells a <em>story</em></p>
          <p className="foot-note">Premium Indian coffee from Chikmagalur &amp; Coorg, roasted in Goa for cafés, hotels and restaurants.</p>
        </div>

        <nav className="foot-col" aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            {FOOTER_EXPLORE.map((l) => <li key={l.href}><PageLink base={base} to={l.href}>{l.label}</PageLink></li>)}
          </ul>
        </nav>

        <nav className="foot-col" aria-label="Blends">
          <h4>Blends</h4>
          <ul>
            {BLENDS.map((b) => <li key={b.id}><PageLink base={base} to={`#blend-${b.id}`}>{b.name}</PageLink></li>)}
          </ul>
        </nav>

        <div className="foot-col">
          <h4>Contact</h4>
          <ul>
            {FOOTER_CONTACT.map((l) => <li key={l.href}><a href={l.href} {...external(l)}>{l.label}</a></li>)}
            <li className="foot-addr">{CONTACT.addressShort}</li>
          </ul>
        </div>
      </div>

      <div className="foot-bottom">
        <span>© {COPYRIGHT_YEAR} Poesia India</span>
        <nav className="foot-legal" aria-label="Legal">
          {LEGAL_LINKS.map((l) => <Link key={l.href} to={l.href}>{l.label}</Link>)}
        </nav>
        <a href="#top">{onStory ? 'Back to the beginning ↑' : 'Back to top ↑'}</a>
      </div>
    </footer>
  );
}
