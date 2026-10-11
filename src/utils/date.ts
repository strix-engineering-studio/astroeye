export function formatDate(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options,
  }).format(parsedDate);
}

export function formatDateTime(date: Date | string | null | undefined) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export function isToday(date: Date | string | null | undefined) {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return false;
  }

  const today = new Date();

  return parsedDate.toDateString() === today.toDateString();
}

function parseDate(date: Date | string | null | undefined): Date | null {
  if (!date) {
    return null;
  }

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}
