const REGISTRATION_CUTOFF_UTC = "2026-08-31T16:00:00Z"; // 2026-09-01 00:00 Asia/Manila

export function isRegistrationOpen(now: Date = new Date()) {
  if (process.env.REGISTRATION_ALWAYS_OPEN === "true") {
    return true;
  }

  return now < new Date(REGISTRATION_CUTOFF_UTC);
}

// The walk-in kiosk is only switched on during the event days.
export function isWalkInOpen() {
  return process.env.WALK_IN_OPEN === "true";
}
