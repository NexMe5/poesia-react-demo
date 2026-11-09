import { TOOLS_CAROUSEL } from '../../data/equipment';

function Tool({ tool, hidden }) {
  return (
    <div className="tm" aria-hidden={hidden || undefined}>
      <div className="tm-img">
        <img src={tool.src} alt={hidden ? '' : tool.size ? `${tool.name} ${tool.size}` : tool.name} style={{ '--th': tool.th }} loading="lazy" decoding="async" />
      </div>
      <span className="tm-cap"><b>{tool.name}</b>{tool.size && <i>{tool.size}</i>}</span>
    </div>
  );
}

/**
 * Phones only: the tools chapter becomes a slow, endless carousel of every tool.
 * The list is rendered twice (the copy hidden from assistive tech) so the loop has no seam.
 */
export default function ToolsCarousel() {
  return (
    <div className="mc tm-marquee" aria-label="Barista tools">
      <div className="tm-track">
        {TOOLS_CAROUSEL.map((t, i) => <Tool key={`a${i}`} tool={t} />)}
        {TOOLS_CAROUSEL.map((t, i) => <Tool key={`b${i}`} tool={t} hidden />)}
      </div>
    </div>
  );
}
