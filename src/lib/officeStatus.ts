// Build-time constant; bump when today surpasses the latest `since` in offices array.
// Dynamic Date.now() is intentionally avoided to keep SSG output deterministic.
export const TODAY_YYYYMM = "2026-05" as const;

export function isOfficeComing(since: string): boolean {
  return since.replace(".", "-") > TODAY_YYYYMM;
}

export function officeAgeYears(since: string): number {
  if (isOfficeComing(since)) return 0;
  const sinceYear = parseInt(since.slice(0, 4), 10);
  const todayYear = parseInt(TODAY_YYYYMM.slice(0, 4), 10);
  return todayYear - sinceYear;
}

export type OfficeInput = {
  id: string;
  city: string;
  country: string;
  flag: string;
  since: string;
};

export type OfficeOpening = OfficeInput & {
  isComing: boolean;
};

export function getOfficeOpenings(offices: ReadonlyArray<OfficeInput>): OfficeOpening[] {
  return [...offices]
    .sort((a, b) => a.since.localeCompare(b.since))
    .map((o) => ({ ...o, isComing: isOfficeComing(o.since) }));
}
