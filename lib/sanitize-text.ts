export function sanitizeText(str: string): string {
  return str.replace(/\u0000|\\u0000/g, "");
}