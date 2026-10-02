export function buildCheckinUrl(id: string) {
  return `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/checkin/${id}`;
}
