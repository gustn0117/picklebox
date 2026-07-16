import { readFile } from "fs/promises";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/data/uploads";
const TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

export async function GET(_req, { params }) {
  const { file } = await params;
  // 경로 조작 방지: 파일명만 허용
  if (!file || file.includes("/") || file.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const buf = await readFile(path.join(UPLOAD_DIR, file));
    const ext = file.split(".").pop().toLowerCase();
    return new Response(buf, {
      headers: {
        "content-type": TYPES[ext] || "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
