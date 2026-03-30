interface ExportableRow {
  [key: string]: string | number | boolean | null;
}

export function toCSV(rows: ExportableRow[], columns?: string[]): string {
  if (rows.length === 0) return "";
  const headers = columns ?? Object.keys(rows[0]);
  const escape = (val: unknown): string => {
    const str = String(val ?? "");
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];
  return lines.join("\n");
}

export function downloadCSV(rows: ExportableRow[], filename: string): void {
  const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
