import { Link } from '../router/Router';
import { img } from '../lib/assets';
import { usePageMeta } from '../lib/usePageMeta';
import './NotFoundPage.css';

/** Any URL the site doesn't have. */
export default function NotFoundPage() {
  usePageMeta(404);
  return (
    <main className="nf wrap">
      <img className="nf-emb" src={img('emblem.webp')} alt="" width="515" height="520" />
      <p className="label">Error 404</p>
      <h1 className="t-title">This cup is <em>empty</em>.</h1>
      <p className="nf-text">The page you were looking for doesn’t exist or has moved.</p>
      <Link className="btn btn-solid" to="/">Back to Poesia</Link>
    </main>
  );
}
