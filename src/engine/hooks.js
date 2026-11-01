import { useEffect, useRef } from 'react';
import { engine } from './scrollEngine';

/** Starts the scroll engine once every chapter below has registered its scenes. */
export function useScrollEngine() {
  useEffect(() => engine.start(), []);
}

/**
 * Registers a scroll scene for the element in `ref`.
 * `setup(el)` gathers what the scene animates and returns { render, ...options, dispose? }.
 */
export function useScene(ref, setup) {
  const setupRef = useRef(setup);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const { render, dispose, ...opts } = setupRef.current(el);
    const remove = engine.addScene(el, render, opts);
    return () => { remove(); if (dispose) dispose(); };
  }, [ref]);
}

/** Runs `fn(scrollY)` on every engine frame (and on jumps); the latest `fn` is always used. */
export function useFrameHook(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => engine.addFrameHook((y) => fnRef.current(y)), []);
}
