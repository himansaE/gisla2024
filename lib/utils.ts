import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeSince(ms: Date, margin = 0): string {
  const diff = Date.now() - ms.getTime() + margin;

  const sec = Math.floor(diff / 1000);

  const years = Math.floor(sec / 31536000);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""}`;
  }

  const months = Math.floor((sec % 31536000) / 2629800);

  if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""}`;
  }

  if (sec >= 3600 * 24) {
    const days = Math.floor(sec / (3600 * 24));
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  if (sec >= 3600) {
    const hours = Math.floor(sec / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  if (sec >= 60) {
    const mins = Math.floor(sec / 60);
    return `${mins} min${mins > 1 ? "s" : ""}`;
  }

  return `${sec} sec${sec > 1 ? "s" : ""}`;
}
