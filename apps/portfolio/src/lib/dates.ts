import type { Project } from "@/data/type";

// timeZone UTC: "2026-06-01" is stored as UTC, so without it US time zones show May 31
export function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Date(value).toLocaleDateString("en-US", {
    ...options,
    timeZone: "UTC",
  });
}

export function projectDates(project: Project) {
  const short = { month: "short", year: "numeric" } as const;
  const start = project.startDate ? formatDate(project.startDate, short) : "?";
  const end = project.isOngoing
    ? "Present"
    : project.endDate
      ? formatDate(project.endDate, short)
      : "?";
  return `${start} - ${end}`;
}
