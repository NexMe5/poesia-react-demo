import { useEffect, useRef } from 'react';
import { engine } from '../../engine/scrollEngine';

const NAV_LINE = 48;   // the header's baseline in px from the top of the screen

/**
 * The header reads the chapter under it: each <section data-tone> says whether it is light or dark
 * at that moment (the prologue and the blends update theirs as their scenes play).
 * The result goes on <html data-tone>, which recolours the nav and swaps the wordmark.
 * Section positions are measured once per layout change, so a scroll frame only compares numbers.
 */
export function useNavTone() {
  const current = useRef('');
  useEffect(() => {
    let bands = [];
    const offMeasure = engine.addMeasureHook(() => {
      bands = [...document.querySelectorAll('main > section[data-tone]')].map((s) => {
        const r = s.getBoundingClientRect();
        return { el: s, top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
      });
    });
    const offFrame = engine.addFrameHook((y) => {
      const line = y + NAV_LINE;
      let tone = 'dark';
      for (const b of bands) if (b.top <= line && b.bottom > line) tone = b.el.dataset.tone;
      if (tone !== current.current) {
        current.current = tone;
        document.documentElement.dataset.tone = tone;
      }
    });
    return () => { offMeasure(); offFrame(); };
  }, []);
}
