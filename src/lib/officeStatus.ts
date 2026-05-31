// Build-time constant; bump when today surpasses the latest `since` in offices array.
// Dynamic Date.now() is intentionally avoided to keep SSG output deterministic.
export const TODAY_YYYYMM = "2026-05" as const;

export function isOfficeComing(since: string): boolean {
  return since.replace(".", "-") > TODAY_YYYYMM;
}
