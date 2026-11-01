import { img } from '../lib/assets';

/**
 * The four blends. `tag` is the name set on the counter edge (lead word bold, the rest light);
 * `alt` mirrors the shot on wide screens (bag left, words right).
 */
export const BLENDS = [
  {
    id: 'espresso', name: 'Espresso Italiano', short: 'Espresso', note: 'Toasty, honeyed, full-bodied',
    tag: { lead: 'Espresso', tail: ' Italiano' },
    accent: '#e6bb45', arabica: 80, robusta: 20, roast: 5,
    bag: { src: img('bag-espresso.webp'), width: 680, height: 1147, breathe: '0s' },
    room: '#34250c', glow: 'rgba(240,190,70,.34)',
  },
  {
    id: 'classico', name: 'Classico', short: 'Classico', note: 'Sweet, fruity & bright', alt: true,
    tag: { lead: 'Classico' },
    accent: '#c98ee6', arabica: 100, robusta: 0, roast: 4,
    bag: { src: img('bag-classico.webp'), width: 673, height: 1127, breathe: '-1.7s' },
    room: '#2a1431', glow: 'rgba(200,130,240,.32)',
  },
  {
    id: 'dolce', name: 'Dolce Vita Breakfast', short: 'Dolce', note: 'Bittersweet chocolate & cocoa',
    tag: { lead: 'Dolce', tail: ' Vita' },
    accent: '#ff6f61', arabica: 50, robusta: 50, roast: 5,
    bag: { src: img('bag-dolce.webp'), width: 676, height: 1150, breathe: '-3.1s' },
    room: '#3a0e12', glow: 'rgba(255,100,90,.32)',
  },
  {
    id: 'crema', name: 'Café Crema', short: 'Crema', note: 'Bold, smooth, made for milk', alt: true,
    tag: { pre: 'Café ', lead: 'Crema' },
    accent: '#7fb0ff', arabica: 10, robusta: 90, roast: 5,
    bag: { src: img('bag-crema.webp'), width: 671, height: 1127, breathe: '-4.4s' },
    room: '#0e1e3a', glow: 'rgba(110,160,255,.32)',
  },
];

export const BLEND_HASHES = BLENDS.map((b) => `#blend-${b.id}`);

/** Beans on the counter: three drop in from the orbit, two were already lying there. Desktop and phone positions. */
export const COUNTER_BEANS = [
  { src: img('rb-00.webp'), x: '43.5vw', y: '84.4vh', xm: '33vw', ym: '70.6vh', w: '46px', r: '28deg', d: '.38s' },
  { src: img('rb-11.webp'), x: '57vw', y: '85vh', xm: '54vw', ym: '71.1vh', w: '38px', r: '-52deg', d: '.52s' },
  { src: img('rb-06.webp'), x: '71vw', y: '82.4vh', xm: '77vw', ym: '69vh', w: '36px', r: '74deg', d: '.64s' },
  { src: img('rb-17.webp'), x: '26.5vw', y: '80.8vh', xm: '6vw', ym: '66.8vh', w: '30px', r: '12deg', far: true },
  { src: img('rb-08.webp'), x: '85.5vw', y: '79.8vh', xm: '95vw', ym: '66.2vh', w: '26px', r: '-24deg', far: true },
];

/**
 * Shot timeline along the section's scroll: 0 hand-off, 1 the range on the counter, then one shot per blend.
 * Shared by the stage director and by navigation (a blend link lands in the middle of its shot).
 */
export const SHOTS = { handoffEnd: 0.028, rangeEnd: 0.17, blendLen: 0.2075 };
export const blendShotAt = (p) =>
  p < SHOTS.handoffEnd ? 0 : p < SHOTS.rangeEnd ? 1 : 2 + Math.min(3, Math.floor((p - SHOTS.rangeEnd) / SHOTS.blendLen));
export const blendShotMiddle = (i) => SHOTS.rangeEnd + SHOTS.blendLen * i + 0.1;
