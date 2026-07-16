// 관리자 세션 — Web Crypto(HMAC-SHA256) 서명 토큰. Edge 미들웨어와 Node 라우트 모두에서 동작.
// Prisma 등 Node 전용 모듈을 import 하지 않는다(Edge 호환 유지).
export const COOKIE_NAME = "pb_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7일(초)

const enc = (s) => new TextEncoder().encode(s);
function secret() {
  return process.env.SESSION_SECRET || "picklebox-dev-secret-change-me";
}
function b64url(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return atob(s);
}
async function sign(data) {
  const key = await crypto.subtle.importKey("raw", enc(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc(data));
  return b64url(new Uint8Array(sig));
}

export async function createToken() {
  const payload = b64url(enc(JSON.stringify({ exp: Date.now() + COOKIE_MAX_AGE * 1000 })));
  return `${payload}.${await sign(payload)}`;
}

export async function verifyToken(token) {
  if (!token || token.indexOf(".") < 0) return false;
  const [payload, sig] = token.split(".");
  if (sig !== (await sign(payload))) return false;
  try {
    const { exp } = JSON.parse(fromB64url(payload));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export function verifyPassword(pw) {
  return typeof pw === "string" && pw === (process.env.ADMIN_PASSWORD || "1234");
}
