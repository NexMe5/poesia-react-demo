import { clamp, ease, lerp, seg } from '../../lib/math';
import { isMobile } from '../../lib/env';
import { q, qa } from '../../lib/dom';

export function createOriginScene(root) {
  const media = q(root, '.origin-media');
  const photo = q(root, '.origin-media img');
  const shade = q(root, '.origin-shade');
  const labels = qa(root, '.ol');
  const lines = qa(root, '.line > span');

  return (p) => {
    // the photo window grows from a card to the whole screen
    const m = ease.inOut(seg(p, 0, 0.42));
    const iy = lerp(22, 0, m);
    const ix = lerp(isMobile() ? 12 : 32, 0, m);
    media.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${lerp(28, 0, m)}px)`;
    photo.style.transform = `scale(${lerp(1.35, 1, m)}) translateY(${lerp(0, -3, p)}%)`;
    shade.style.opacity = seg(p, 0.3, 0.5);
    labels.forEach((el, i) => {
      const t = ease.out(seg(p, 0.4 + i * 0.22, 0.6 + i * 0.22));
      el.style.opacity = t;
      el.style.transform = `translateY(${(1 - t) * 20}px)`;
    });
    // lines rise and fade in together, so a half-scrolled frame never shows stray letter tops
    lines.forEach((el, i) => {
      const t = ease.out(seg(p, 0.44 + i * 0.07, 0.64 + i * 0.07));
      el.style.transform = `translate3d(0,${(1 - t) * 110}%,0)`;
      el.style.opacity = clamp(t * 1.25);
    });
  };
}
