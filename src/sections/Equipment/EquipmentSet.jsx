import { cx } from '../../lib/dom';
import ToolsCarousel from './ToolsCarousel';

/** One chapter's cut-outs standing on the stage floor, each with its name (and spec) beneath. */
export default function EquipmentSet({ chapter }) {
  return (
    <div className={cx('eq-set', chapter.variant)} role="group" aria-label={chapter.label}>
      {chapter.items.map((item) => (
        <figure
          key={item.name}
          className={cx('mc', item.tall && 'tall', item.hideOnPhone && 'hide-m')}
          style={item.h ? { '--h': item.h } : undefined}
        >
          <img src={item.src} alt={item.alt} width={item.width} height={item.height} />
          <figcaption>
            <b>{item.name}</b>
            {item.spec && <span>{item.spec}</span>}
          </figcaption>
        </figure>
      ))}
      {chapter.carousel && <ToolsCarousel />}
    </div>
  );
}
