// Evaluation entry points (navbar link, check-in button) stay hidden until this date.
export const EVALUATION_LAUNCH_AT = "2026-10-04T00:00:00+08:00";

export function isEvaluationLaunched() {
  return Date.now() >= new Date(EVALUATION_LAUNCH_AT).getTime();
}
