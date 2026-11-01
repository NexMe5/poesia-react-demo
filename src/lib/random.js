/**
 * Deterministic Park–Miller generator. The approved prototype drew every "random" detail
 * (tear jitter, bean chips, leaf shadows) from one stream seeded with 7; each consumer here
 * starts from the same seed and skips the draws that came before it, so the shapes match exactly.
 *
 *   tear jitter + fibres  draws    0 – 115
 *   bean chips            draws  116 – 211
 *   leaf shadows          draws  212 – …
 */
export function seededRandom(seed = 7, skip = 0) {
  let s = seed;
  const next = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < skip; i++) next();
  return next;
}

export const RNG_SEED = 7;
export const RNG_OFFSET = { tear: 0, chips: 116, leaves: 212 };
