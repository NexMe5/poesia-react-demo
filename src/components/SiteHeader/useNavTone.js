import { useRef } from 'react';
import { useFrameHook } from '../../engine/hooks';

const NAV_LINE = 48;   // the header's baseline in px from the top of the screen

/**
 * The header reads the chapter under it: each <section data-tone> says whether it is light or dark
 * at that moment (the prologue and the blends update theirs as their scenes play).
 * The result goes on <html data-tone>, which recolours the nav and swaps the wordmark.
 */
export function useNavTone() {
  const current = useRef('');
  useFrameHook(() => {
    let tone = 'dark';
    for (const s of document.querySelectorAll('main > section[data-tone]')) {
      const r = s.getBoundingClientRect();
      if (r.top <= NAV_LINE && r.bottom > NAV_LINE) tone = s.dataset.tone;
    }
    if (tone !== current.current) {
      current.current = tone;
      document.documentElement.dataset.tone = tone;
    }
  });
}
