import { landingFor } from './landings';
import { SHOTS } from '../data/blends';
import { docTop, pinLen } from '../lib/dom';

/**
 * The story's resting frames, top to bottom: where the ← → buttons (components/StoryNav) glide to.
 * Each is a scroll position where a chapter, or one beat inside it, has finished playing and stands still,
 * so a visitor who taps through sees every shot. Read from the page at the moment of the tap (layout, not
 * per frame). Chapter landings come from the chapters themselves (navigation/landings); the beats inside a
 * chapter follow its scene's resting plateaus, noted next to each.
 */
const at = (sel, frac) => {
  const el = document.querySelector(sel);
  return el ? docTop(el) + pinLen(el) * frac : null;
};

export function storyStops() {
  const stops = [];
  const add = (y, shot = false) => { if (y != null && Number.isFinite(y)) stops.push({ y: Math.max(0, Math.round(y)), shot }); };

  // prologue: the bean has torn open and the four bags stand on the sunlit wall (story ≈ .75 of its .8)
  add(at('#top', 0.62));
  add(landingFor('#origin'));
  // craft: Altitude, Roasted, Soil to cup (craftScene: plateaus at qp 0, .5, 1 → p .04 + .83·qp)
  add(landingFor('#craft'));
  add(at('#craft', 0.455));
  add(at('#craft', 0.82));
  // blends: the range on the counter, then each blend in focus. These shots are timed CSS animations that start
  // the moment their line is crossed, so the stop sits just past the line (not mid-shot, as a blend link does):
  // the glide crosses it early and the shot plays alongside the glide instead of after it
  // (`shot`: between two of these the page can simply be set, see StoryNav)
  add(at('#blends', SHOTS.handoffEnd + 0.03), true);
  for (let i = 0; i < 4; i++) add(at('#blends', SHOTS.rangeEnd + SHOTS.blendLen * i + 0.035), true);
  // ritual: the circle is open and the quote has risen in
  add(at('.ritual', 0.93));
  // journey: each card in turn at the centre of the screen
  const journey = document.getElementById('journey');
  const track = journey && journey.querySelector('.journey-track');
  if (track) {
    const distance = Math.max(1, track.scrollWidth - window.innerWidth);
    const len = pinLen(journey);
    [...track.querySelectorAll('.jcard')].forEach((card, i) => {
      if (i === 0) return;   // the title card is where the chapter opens
      const shift = Math.min(distance, Math.max(0, track.offsetLeft + card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2));
      add(docTop(journey) + (shift / distance) * len);
    });
  }
  // equipment: Machines, Grinders, Automatic, Tools (equipmentScene: plateaus at p .04 + .91·i/3)
  add(landingFor('#equipment'));
  for (let i = 1; i < 4; i++) add(at('#equipment', 0.04 + (0.91 * i) / 3));
  // partnership: the promise read out, then the café moments and the closing line
  add(landingFor('#partner'));
  const sign = document.querySelector('.promise-sign');
  if (sign) add(docTop(sign) + sign.offsetHeight - window.innerHeight * 0.82);
  // epilogue: the bean closes over the wordmark, then every way to get in touch
  const epi = document.querySelector('.epi-stage');
  if (epi) add(docTop(epi) + (epi.offsetHeight - window.innerHeight) / 2);
  add(landingFor('#contact'));
  // and the foot of the page, so the last → shows the address, the socials and the footer whole
  const max = document.documentElement.scrollHeight - window.innerHeight;
  add(max);

  const seen = new Set();
  return stops
    .map((s) => ({ ...s, y: Math.min(s.y, max) }))
    .sort((a, b) => a.y - b.y)
    .filter((s) => !seen.has(s.y) && seen.add(s.y));
}

/** The first resting frame below `y` (a few px of slack, so a stop already reached is not repeated). */
export const nextStop = (stops, y) => stops.find((s) => s.y > y + 24) ?? null;

/** The last resting frame above `y`; the very top of the page counts as the first stop. */
export const prevStop = (stops, y) => [{ y: 0, shot: false }, ...stops].filter((s) => s.y < y - 24).pop() ?? null;

/** The stop the page is resting on now, if any. */
export const stopAt = (stops, y) => stops.find((s) => Math.abs(s.y - y) <= 24) ?? null;

/**
 * Where the story moves while you scroll: the stretches of the page over which a scrubbed reveal plays (the bean
 * tearing open, the origin's words rising in, the ritual circle opening, a craft or equipment chapter turning, the
 * journey sliding). A glide slows down through these so each reveal plays at about the pace of a calm scroll,
 * and moves quickly over the stretches where nothing on screen changes. Fractions follow each scene's timing.
 * Each zone is [from, to, seconds?]: the three signature reveals get a fixed time on screen (REVEAL_S, tuned
 * so each one visibly plays in ~0.45 s), the others are crossed at a steady pace (StoryNav).
 */
export const REVEAL_S = { tear: 0.98, ritual: 0.98 };
export function storyZones() {
  const zones = [];
  const vh = window.innerHeight;
  const span = (sel, a, b, before = 0, secs = null) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const top = docTop(el);
    const len = pinLen(el);
    zones.push([top + len * a - before * vh, top + len * b, secs]);
  };
  span('#top', 0, 0.104);                 // the crack glows down the bean
  span('#top', 0.104, 0.416, 0, REVEAL_S.tear);   // the dark stage tears open (prologueScene: story .13–.52)
  span('#top', 0.416, 0.62);              // the range rising
  span('#top', 0.83, 1);                  // the range lifting off
  span('#origin', 0, 0.5);                // the label and the three lines rise in (the photo stays still)
  span('#craft', 0, 0.06, 1);             // the bag arriving as the cream stage scrolls up
  span('#craft', 0.165, 0.33);            // Altitude → Roasted
  span('#craft', 0.58, 0.745);            // Roasted → Soil to cup
  span('#craft', 0.89, 0.955);            // the bag handed over to the blends
  span('.ritual', 0.08, 0.5, 0, REVEAL_S.ritual);  // the circle opens
  span('.ritual', 0.5, 0.91);             // the quote rises in
  span('#journey', 0, 1);                 // the cards slide past
  span('#equipment', 0, 0.07, 1);         // Machines arriving
  for (let i = 0; i < 3; i++) span('#equipment', 0.04 + 0.91 * ((i + 0.32) / 3), 0.04 + 0.91 * ((i + 0.68) / 3));
  return zones.sort((a, b) => a[0] - b[0]);
}

/**
 * Where the ← → buttons are shown: from the moment the Origin's words have all risen in, to the end of the
 * equipment chapter (its last set, Tools). Not over the intro and hero, nor from the partnership onwards.
 */
export function navRange() {
  const origin = document.getElementById('origin');
  const equipment = document.getElementById('equipment');
  if (!origin || !equipment) return [0, Infinity];
  return [docTop(origin) + pinLen(origin) * 0.45, docTop(equipment) + pinLen(equipment)];
}
