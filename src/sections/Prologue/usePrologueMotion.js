import { useEffect } from 'react';
import { engine } from '../../engine/scrollEngine';
import { q, qa } from '../../lib/dom';
import { createTear } from './tear';
import { createWordmark } from './wordmark';
import { createCoffeeDust } from './coffeeDust';
import { createPrologueScene } from './prologueScene';

/** Wires the prologue's canvas effects and its scroll scene; everything is torn down on unmount. */
export function usePrologueMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    const stage = q(root, '.sticky');
    const beanStage = q(root, '.bean-stage');
    let shift = 0;
    let story = 0;

    const tear = createTear({
      stage,
      beanStage,
      panelL: q(root, '.tear-l .panel'),
      panelR: q(root, '.tear-r .panel'),
      fiberL: q(root, '.tear-l .fiber'),
      fiberR: q(root, '.tear-r .fiber'),
      shadeL: q(root, '.tear-l .tear-shade'),
      shadeR: q(root, '.tear-r .tear-shade'),
      crackLine: q(root, '.crack polyline'),
    });
    tear.build(shift);

    const wordmark = createWordmark({
      canvases: qa(root, '.wmark'),
      stage,
      beanStage,
      tagline: q(root, '.intro-bottom'),
      reducedMotion: engine.reducedMotion,
      onCenterShift: (dx) => {
        shift = dx;
        beanStage.style.setProperty('--wmx', `${dx.toFixed(1)}px`);
        tear.build(shift);
      },
    });

    // the dust only draws while it can be seen: the scene fades it out over the first 8% of the story,
    // so it stops before the crack and the tear, the busiest frames of the intro
    // nor while the loader still covers it: it used to draw 30 full-screen frames a second behind the loader,
    // competing with the loader's own animation for the phone's main thread
    const html = document.documentElement;
    const dust = createCoffeeDust({
      canvas: q(root, '.dust'),
      beanStage,
      isActive: () => story < 0.08 && !html.classList.contains('pl-wait'),
      reducedMotion: engine.reducedMotion,
    });
    const opened = new MutationObserver(() => {
      if (html.classList.contains('pl-wait')) return;
      opened.disconnect();
      dust.wake();
    });
    opened.observe(html, { attributes: true, attributeFilter: ['class'] });

    const offResize = engine.addResizeHook(() => { tear.build(shift); wordmark.paint(); dust.size(); });
    const offScene = engine.addScene(root, createPrologueScene(root, (p) => { story = p; if (p < 0.08) dust.wake(); }), { lag: 0.11 });

    return () => { opened.disconnect(); offScene(); offResize(); dust.dispose(); wordmark.dispose(); };
  }, [ref]);
}
