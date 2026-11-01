import { img } from '../lib/assets';

/** "What makes Poesia special": three chapters around one pinned bag. */
export const CRAFT_CHAPTERS = [
  { word: 'Altitude', wordSize: '15.6vw', pillar: 'Grown at altitude', photo: img('origin.webp'), position: '50% 30%', caption: 'Chikmagalur & Coorg' },
  { word: 'Roasted', wordSize: '17.6vw', pillar: 'Roasted our way', photo: img('still-life.webp'), position: '22% 70%', caption: 'Roasted in Goa' },
  { word: 'Soil to cup', wordSize: '11.4vw', pillar: 'Soil to cup', photo: img('cafe-latte.webp'), position: undefined, caption: "In your guest's cup" },
];

/** Three beans orbiting the bag. */
export const ORBIT_BEANS = [
  { src: img('rb-00.webp'), width: 72 },
  { src: img('rb-11.webp'), width: 58 },
  { src: img('rb-06.webp'), width: 62 },
];
