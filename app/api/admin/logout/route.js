import { cookies } from "next/headers";
import { COOKIE_NAME } from "../../../lib/auth";

async function clear() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  return Response.json({ ok: true });
}

export const POST = clear;
export const GET = clear;
