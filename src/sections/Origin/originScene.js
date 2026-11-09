import { clamp, ease, seg } from '../../lib/math';
import { q, qa } from '../../lib/dom';

/**
 * I · Origin: the photo stands still, full screen, from the moment the chapter covers the hero; only the words
 * move. The shade deepens under them, the label rises in, then the three lines one after another. They start
 * as soon as the chapter pins, so there is no stretch of scrolling where nothing changes, and the rest of the
 * chapter is time to read.
 */
export function createOriginScene(root) {
  const dawn = q(root, '.origin-dawn');
  const shade = q(root, '.origin-shade');
  const labels = qa(root, '.ol');
  const lines = qa(root, '.line > span');

  return (p) => {
    // p runs from -1 (the photo's top edge at the foot of the screen) to 0 (it fills the screen). The photo rises
    // out of the cream wall through a band of morning haze that hides its top edge the whole way up (the edge is
    // on screen until p = 0, so the haze stays whole until then). Once the photo is pinned the haze scrolls on up
    // with the chapter's edge and fades as it goes, like mist lifting off the hills. Opacity only: no repaint.
    dawn.style.opacity = 1 - seg(p, 0, 0.12);
    shade.style.opacity = seg(p, 0.02, 0.2);
    labels.forEach((el, i) => {
      const t = ease.out(seg(p, 0.06 + i * 0.22, 0.26 + i * 0.22));
      el.style.opacity = t;
      el.style.transform = `translate3d(0,${(1 - t) * 20}px,0)`;
    });
    // lines rise and fade in together, so a half-scrolled frame never shows stray letter tops
    lines.forEach((el, i) => {
      const t = ease.out(seg(p, 0.1 + i * 0.07, 0.3 + i * 0.07));
      el.style.transform = `translate3d(0,${(1 - t) * 110}%,0)`;
      el.style.opacity = clamp(t * 1.25);
    });
  };
}
