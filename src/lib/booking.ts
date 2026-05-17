/** Business hours: 9:00 AM – 6:00 PM (local time) */
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 18 * 60;

export const INVENTORY_BOOKING_TYPES = [
  "Test Drive",
  "Virtual Tour",
  "Dealership Visit",
  "Request Information",
] as const;

export const CONTACT_BOOKING_TYPES = [
  "Service Appointment",
  "General Inquiry",
  "Test Drive Inquiry",
] as const;

export type ContactMethod = "Email" | "Phone";

export function validateScheduledAt(value: string | Date): string | null {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "Please select a valid date and time.";
  }

  const now = new Date();
  if (date.getTime() < now.getTime() - 60_000) {
    return "Please choose a future date and time.";
  }

  const totalMinutes = date.getHours() * 60 + date.getMinutes();
  if (totalMinutes < OPEN_MINUTES || totalMinutes > CLOSE_MINUTES) {
    return "Appointments are available between 9:00 AM and 6:00 PM.";
  }

  return null;
}

/** Minimum value for datetime-local inputs (today at midnight, local). */
export function getMinDateTimeLocal(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T00:00`;
}

export function formatStatusLabel(status: string): string {
  if (status === "under reviewing") return "Under Review";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
