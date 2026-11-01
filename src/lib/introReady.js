/**
 * The intro wordmark is painted into a canvas once its typeface has loaded.
 * The preloader waits for that moment so the first screen never appears half-drawn.
 */
let resolveReady;
export const introReady = new Promise((resolve) => { resolveReady = resolve; });
export const markIntroReady = () => resolveReady();
