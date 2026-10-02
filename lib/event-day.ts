import { eventInfo } from "@/lib/seo";

export type EventDay = "day1" | "day2";

const EVENT_DAY_DATES: Record<EventDay, string> = {
  day1: eventInfo.startDate,
  day2: eventInfo.endDate,
};

// Day 2 starts at midnight Manila time on the event's final date.
const DAY_TWO_START = new Date(`${eventInfo.endDate}T00:00:00+08:00`).getTime();

export function getCurrentEventDay(now: number = Date.now()): EventDay {
  return now >= DAY_TWO_START ? "day2" : "day1";
}

export function formatEventDayDate(day: EventDay): string {
  return new Date(`${EVENT_DAY_DATES[day]}T00:00:00+08:00`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}
