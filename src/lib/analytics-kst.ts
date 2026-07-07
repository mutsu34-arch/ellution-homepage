const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** ISO 시각 → KST 기준 YYYY-MM-DD */
export function toKstDateString(iso: string | Date): string {
  const ms = typeof iso === "string" ? new Date(iso).getTime() : iso.getTime();
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** KST 기준 N일 전 00:00의 ISO 시각(UTC) */
export function kstPeriodStartIso(days: number): string {
  const todayKst = toKstDateString(new Date());
  const [y, m, d] = todayKst.split("-").map(Number);
  const startKstMs = Date.UTC(y, m - 1, d - (days - 1), 0, 0, 0) - KST_OFFSET_MS;
  return new Date(startKstMs).toISOString();
}
