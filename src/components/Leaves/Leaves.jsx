import { memo } from 'react';
import { img } from '../../lib/assets';
import './Leaves.css';

/**
 * A soft leaf shadow. `variant` places it for its chapter:
 * cl-a / cl-b (cream stage), pl-a / pl-b / pl-c (partnership), nl-a / nl-b (+ ne-a / ne-b) (night room).
 *
 * The plant (leafShadow.js) used to be drawn as SVG and softened with a CSS blur filter. A blur filter is re-run
 * whenever anything else in its stage repaints, and these sit in every pinned chapter, so on a phone it was
 * paid again and again mid-scroll. It is now the same plant, blurred once into a picture (rendered from leafShadow.js):
 * leaves.webp in the brochure brown, leaves-night.webp in black for the night room.
 * `eager`: the hero's shadow, part of the first screen; every other one loads as its chapter comes near.
 */
function Leaves({ variant = '', eager = false }) {
  const night = /(^|\s)nl-/.test(variant);
  return (
    <img
      className={`leaves ${variant}`.trim()}
      src={img(night ? 'leaves-night.webp' : 'leaves.webp')}
      alt=""
      aria-hidden="true"
      width="600"
      height="420"
      loading={eager ? undefined : 'lazy'}
      decoding="async"
      draggable="false"
    />
  );
}

export default memo(Leaves);
