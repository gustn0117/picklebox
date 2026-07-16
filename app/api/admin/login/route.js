import { cookies } from "next/headers";
import { verifyPassword, createToken, COOKIE_NAME, COOKIE_MAX_AGE } from "../../../lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!verifyPassword(password)) {
    return Response.json({ ok: false, error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  const token = await createToken();
  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return Response.json({ ok: true });
}
