export interface NotificationPreferences {
  emailOnStatusChange: boolean;
  emailOnDeadline: boolean;
  emailWeeklySummary: boolean;
  reminderDaysBefore: number;
}

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailOnStatusChange: true,
  emailOnDeadline: true,
  emailWeeklySummary: false,
  reminderDaysBefore: 3,
};

export function shouldNotify(
  event: "statusChange" | "deadline" | "weeklySummary",
  prefs: NotificationPreferences
): boolean {
  const map: Record<string, keyof NotificationPreferences> = {
    statusChange: "emailOnStatusChange",
    deadline: "emailOnDeadline",
    weeklySummary: "emailWeeklySummary",
  };
  return Boolean(prefs[map[event]]);
}

export function formatDeadlineReminder(
  company: string,
  role: string,
  deadline: Date
): string {
  const days = Math.ceil(
    (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return `⚠️ Deadline passed for ${role} at ${company}`;
  if (days === 1) return `🔔 Tomorrow: ${role} at ${company} deadline`;
  return `📅 ${days} days until ${role} at ${company} deadline`;
}
