import { createHash } from "crypto";
/**
 * Calculate Git SHA-1 hash for a file (matching GitHub's blob format)
 * Git blob format: "blob <size>\0<content>"
 */
export function calculateGitSHA(content: string): string {
  const buffer = Buffer.from(content);
  const header = `blob ${buffer.length}\0`;
  const sha = createHash("sha1");
  sha.update(header);
  sha.update(buffer);
  return sha.digest("hex");
}