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

    // the dust only draws while the bean is still on screen
    const dust = createCoffeeDust({
      canvas: q(root, '.dust'),
      beanStage,
      isActive: () => story < 0.3,
      reducedMotion: engine.reducedMotion,
    });

    const offResize = engine.addResizeHook(() => { tear.build(shift); wordmark.paint(); dust.size(); });
    const offScene = engine.addScene(root, createPrologueScene(root, (p) => { story = p; }), { lag: 0.11 });

    return () => { offScene(); offResize(); dust.dispose(); wordmark.dispose(); };
  }, [ref]);
}
