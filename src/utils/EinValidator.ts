// EIN validation pattern from ANALYSIS.md
const EIN_REGEX = /^(\d{9}|\d{2}-\d{7})$/;

export function validateEin(ein: string): boolean {
  return EIN_REGEX.test(ein);
}

/** Formats a 9-digit EIN string as XX-XXXXXXX */
export function formatEin(ein: string): string {
  const digits = ein.replace(/-/g, '');
  if (digits.length !== 9 || !/^\d{9}$/.test(digits)) {
    throw new Error(`Invalid EIN: "${ein}". Must be 9 digits.`);
  }
  return `${digits.slice(0, 2)}-${digits.slice(2)}`;
}
