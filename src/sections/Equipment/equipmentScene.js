import { clamp, ease, seg } from '../../lib/math';
import { isMobile } from '../../lib/env';
import { q, qa } from '../../lib/dom';

/**
 * VII · Equipment: four chapters (Machines, Grinders, Automatic, Tools) on one stage.
 * The giant word changes per chapter; the machines travel like a camera dolly, each a beat behind the last.
 */
export function createEquipmentScene(section) {
  const words = qa(section, '.eq-giant span');
  const sets = qa(section, '.eq-set');
  const pieces = sets.map((set) => qa(set, '.mc'));
  const giant = q(section, '.eq-giant');
  const stage = q(section, '.sticky');

  function render(p) {
    const e = ease.out(clamp(1 + p * 1.05));   // the first chapter rises in from the moment the stage enters
    const N = sets.length;
    const qp = seg(p, 0.04, 0.95);
    const u = qp * (N - 1);
    const k = Math.min(N - 2, Math.floor(u));
    const t = u - k;
    const f = Math.min(N - 1, k + ease.inOut(clamp((t - 0.32) / 0.36)));   // 0 → 1 → 2 → 3 with resting plateaus
    words.forEach((w, i) => {
      const d = f - i;
      const a = Math.abs(d);
      w.style.opacity = clamp(1 - a * 1.8) * (i === 0 ? e : 1);
      w.style.transform = `translate(-50%,-50%) translate3d(0,${-d * 18 + (i === 0 ? (1 - e) * 10 : 0)}vh,0) scale(${1 - Math.min(a, 1) * 0.1})`;
    });
    sets.forEach((set, i) => {
      const d = f - i;
      set.style.visibility = Math.abs(d) > 0.8 ? 'hidden' : 'visible';
      pieces[i].forEach((m, j) => {
        const dd = d * (1 + j * 0.2);
        const a = Math.abs(dd);
        m.style.opacity = clamp(1 - a * 1.9) * (i === 0 ? e : 1);
        m.style.transform = `translate3d(${-dd * 34}vw,${a * 5 + (i === 0 ? (1 - e) * 12 : 0)}vh,0)`;
      });
    });
  }

  function size() {
    // only a word too wide for the screen (AUTOMATIC) is eased down to fit; the others keep their full size
    words.forEach((w) => {
      w.style.fontSize = '';
      const fit = (window.innerWidth * 0.96) / w.offsetWidth;
      if (fit < 1) w.style.fontSize = `${(parseFloat(getComputedStyle(w).fontSize) * fit).toFixed(1)}px`;
    });
    // phones: machines never rise into their word. Their height is capped by the real space left between the
    // word's baseline and the stage floor, measured on the device itself (browser toolbars change the height)
    const G = giant.getBoundingClientRect();
    const st = stage.getBoundingClientRect();
    const floor = st.top + st.height * 0.68;
    sets.forEach((set, i) => {
      const imgs = qa(set, '.mc:not(.tm-marquee) img');
      imgs.forEach((im) => { im.style.height = im.style.maxHeight = ''; });
      if (!isMobile() || !words[i]) return;
      const fs = parseFloat(getComputedStyle(words[i]).fontSize);
      const wordBottom = G.top + G.height * 0.34 + fs * 0.4;
      const room = Math.max(60, floor - wordBottom - 14);
      imgs.forEach((im) => { if (im.getBoundingClientRect().height > room) im.style.height = `${room}px`; });
    });
  }

  return { render, size };
}
