export type ApplicationStatus =
  | "applied"
  | "screening"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface FilterCriteria {
  query?: string;
  statuses?: ApplicationStatus[];
  dateRange?: { from: Date; to: Date };
  tags?: string[];
  sortBy?: "date" | "company" | "status" | "salary";
  sortOrder?: "asc" | "desc";
}

export function buildSearchParams(filters: FilterCriteria): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.statuses?.length)
    params.set("status", filters.statuses.join(","));
  if (filters.dateRange) {
    params.set("from", filters.dateRange.from.toISOString().split("T")[0]);
    params.set("to", filters.dateRange.to.toISOString().split("T")[0]);
  }
  if (filters.tags?.length) params.set("tags", filters.tags.join(","));
  if (filters.sortBy) params.set("sort", filters.sortBy);
  if (filters.sortOrder) params.set("order", filters.sortOrder);
  return params;
}

export function parseSearchParams(params: URLSearchParams): FilterCriteria {
  return {
    query: params.get("q") ?? undefined,
    statuses: params.get("status")?.split(",") as ApplicationStatus[],
    sortBy: (params.get("sort") as FilterCriteria["sortBy"]) ?? undefined,
    sortOrder:
      (params.get("order") as FilterCriteria["sortOrder"]) ?? undefined,
    tags: params.get("tags")?.split(","),
  };
}
