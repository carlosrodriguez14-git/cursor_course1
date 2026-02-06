"use client";

export default function maskKey(value) {
  if (!value) {
    return "";
  }

  const prefix = value.startsWith("tvly-") ? "tvly-" : value.slice(0, 4);
  const maskedLength = Math.max(value.length - prefix.length, 12);
  return `${prefix}${"*".repeat(maskedLength)}`;
}
