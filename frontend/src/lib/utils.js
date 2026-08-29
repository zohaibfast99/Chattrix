export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const sameDay = (a, b) => a.toDateString() === b.toDateString();

export function formatDayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (sameDay(d, today)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(d.getFullYear() !== today.getFullYear() && { year: "numeric" }),
  });
}

// True when `msg` opens a new calendar day relative to the message before it.
export function startsNewDay(msg, prev) {
  if (!prev) return true;
  return !sameDay(new Date(msg.createdAt), new Date(prev.createdAt));
}
