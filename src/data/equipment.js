import { img } from '../lib/assets';

/**
 * Equipment & expertise: four chapters on one stage. Each chapter has its giant word and a set of cut-outs.
 * `tall` uses the taller machine height; `roomy` widens the gap; tools carry their own height (`h`).
 */
export const EQUIPMENT_CHAPTERS = [
  {
    word: 'Machines', label: 'Traditional espresso machines',
    items: [
      { src: img('eq-astoria.webp'), alt: 'Astoria Tanya R espresso machine in red', width: 588, height: 426, name: 'Astoria Tanya R', spec: 'Up to 3 groups · Copper boiler' },
      { src: img('eq-cime-eera.webp'), alt: 'CIME Eera espresso machine', width: 544, height: 381, name: 'CIME Eera', spec: 'Shot timer · Auto cleaning' },
    ],
  },
  {
    word: 'Grinders', label: 'Grinders', variant: 'roomy grinders',
    items: [
      { src: img('eq-motion65.webp'), alt: 'Eureka Motion 65 grinder', width: 313, height: 663, name: 'Eureka Motion 65', spec: '65 mm flat burrs', tall: true },
      { src: img('eq-motion75.webp'), alt: 'Eureka Motion 75 grinder', width: 252, height: 716, name: 'Eureka Motion 75', spec: '75 mm flat burrs', tall: true },
      { src: img('eq-bdose.webp'), alt: 'B-Dose Digit grinder', width: 313, height: 663, name: 'B-Dose Digit', spec: '2-dose & continuous', tall: true },
    ],
  },
  {
    word: 'Automatic', label: 'Fully automatic machines', variant: 'roomy',
    items: [
      { src: img('eq-f11.webp'), alt: 'Dr. Coffee F11 bean-to-cup machine', width: 295, height: 459, name: 'Dr. Coffee F11', spec: 'Up to 100 cups a day', tall: true },
      { src: img('eq-m10.webp'), alt: 'Dr. Coffee M10 bean-to-cup machine', width: 292, height: 485, name: 'Dr. Coffee M10', spec: 'Dual pump · 7-inch screen', tall: true },
      { src: img('eq-minibar.webp'), alt: 'Dr. Coffee Minibar bean-to-cup machine', width: 388, height: 668, name: 'Dr. Coffee Minibar', spec: 'Up to 24 drinks · Dual boiler', tall: true },
    ],
  },
  {
    word: 'Tools', label: 'Barista tools', variant: 'tools-set', carousel: true,
    items: [
      { src: img('eq-pitcher600.webp'), alt: 'Stainless steel milk pitcher', width: 443, height: 408, name: 'Milk pitcher', spec: '350 ml · 600 ml', h: '33vh' },
      { src: img('eq-distributor.webp'), alt: 'Coffee distributor', width: 253, height: 234, name: 'Distributor', h: '21vh' },
      { src: img('eq-knockbox.webp'), alt: 'Knock box', width: 297, height: 344, name: 'Knock box', h: '28vh' },
      { src: img('eq-scale.webp'), alt: 'Barista weighing scale', width: 288, height: 285, name: 'Weighing scale', h: '22vh', hideOnPhone: true },
      { src: img('eq-tamper.webp'), alt: 'Barista tamper', width: 180, height: 331, name: 'Tamper', h: '36vh' },
    ],
  },
];

/** Phones: the tools chapter becomes a slow carousel of every tool. `th` is each cut-out's height. */
export const TOOLS_CAROUSEL = [
  { src: img('eq-tamper.webp'), name: 'Tamper', th: '17vh' },
  { src: img('eq-distributor.webp'), name: 'Distributor', th: '10.5vh' },
  { src: img('eq-mat2.webp'), name: 'Tamping mat', th: '8vh' },
  { src: img('eq-pitcher350.webp'), name: 'Milk pitcher', size: '350 ml', th: '11vh' },
  { src: img('eq-pitcher600.webp'), name: 'Milk pitcher', size: '600 ml', th: '13.5vh' },
  { src: img('eq-knockbox.webp'), name: 'Knock box', th: '12.5vh' },
  { src: img('eq-scale.webp'), name: 'Weighing scale', th: '9.5vh' },
];
