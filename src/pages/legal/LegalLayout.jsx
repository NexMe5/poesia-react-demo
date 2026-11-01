import { useEffect, useState } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import Footer from '../../components/Footer/Footer';
import { Link } from '../../router/Router';
import { img } from '../../lib/assets';
import { BUSINESS, LEGAL_LINKS } from '../../data/site';
import './LegalLayout.css';

const pad = (n) => String(n).padStart(2, '0');

/** Highlights the contents entry of the section currently being read. */
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
      const first = ids.find((id) => seen.get(id));
      if (first) setActive(first);
    }, { rootMargin: '-20% 0px -65% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Contents({ sections, active, onPick }) {
  return (
    <ol className="legal-toc-list">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className={active === s.id ? 'on' : undefined} onClick={onPick}>
            <span className="legal-num">{pad(i + 1)}</span>{s.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Layout for a legal document page (Privacy Policy, Terms & Conditions) in the brand's cream "sunlit" world:
 * a quiet header, the title block, a contents list that follows the reader, numbered sections and the site footer.
 */
export default function LegalLayout({ doc }) {
  const ids = doc.sections.map((s) => s.id);
  const active = useActiveSection(ids);
  const other = LEGAL_LINKS.find((l) => !l.href.includes(doc.slug));

  return (
    <div className="legal">
      <a className="legal-skip" href="#legal-body">Skip to content</a>
      <header className="legal-nav wrap" id="top">
        <Link className="brand" to="/" aria-label="Poesia, home">
          <img className="emb" src={img('emblem.webp')} alt="" width="515" height="520" />
          <img className="wm" src={img('wordmark-dark.png')} alt="Poesia" width="900" height="309" />
        </Link>
        <nav className="legal-nav-links" aria-label="Legal">
          {other && <Link to={other.href}>{other.label}</Link>}
          <Link className="legal-back" to="/">← Back to Poesia</Link>
        </nav>
      </header>

      <main className="legal-main">
        <Leaves variant="pl-a" />
        <Leaves variant="pl-c" />
        <section className="legal-hero wrap">
          <p className="label legal-kicker">{doc.label}</p>
          <h1 className="t-title legal-title">{doc.title}</h1>
          <p className="legal-meta label">Effective {doc.effective} · {BUSINESS.name}</p>
          <p className="legal-intro">{doc.intro}</p>
        </section>

        <div className="legal-layout wrap">
          <aside className="legal-toc" aria-label="Contents">
            <p className="label">Contents</p>
            <Contents sections={doc.sections} active={active} />
          </aside>
          <details className="legal-toc-m">
            <summary className="label">Contents</summary>
            <Contents sections={doc.sections} active={active} onPick={(e) => e.currentTarget.closest('details').removeAttribute('open')} />
          </details>

          <article className="legal-body" id="legal-body">
            {doc.sections.map((s, i) => (
              <section key={s.id} id={s.id} className="legal-section" aria-labelledby={`${s.id}-h`}>
                <span className="legal-num" aria-hidden="true">{pad(i + 1)}</span>
                <h2 id={`${s.id}-h`}>{s.title}</h2>
                {s.body}
              </section>
            ))}
            <p className="legal-updated label">Last updated {doc.effective}</p>
          </article>
        </div>
      </main>

      <div className="legal-end night">
        <Leaves variant="nl-a ne-a" />
        <Footer base="/" />
      </div>
    </div>
  );
}
