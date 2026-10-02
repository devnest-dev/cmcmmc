"use client";

import { useEffect, useRef, useState } from "react";

const TWEEN_MS = 800;

// Counts up (or down) to `target` with an ease-out curve instead of jumping.
export default function useTweenedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;

    if (from === target) {
      return;
    }

    const start = performance.now();
    let frame = 0;

    function step(now: number) {
      const progress = Math.min(1, (now - start) / TWEEN_MS);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(from + (target - from) * eased);

      valueRef.current = next;
      setValue(next);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    }

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
