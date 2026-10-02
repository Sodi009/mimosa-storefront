import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "mimosa_admin_session";
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function sign(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken() {
  const expiresAt = String(Date.now() + SESSION_LIFETIME_MS);
  return `${expiresAt}.${sign(expiresAt)}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (Date.now() > Number(expiresAt)) return false;

  const expected = sign(expiresAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPassword(password) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
