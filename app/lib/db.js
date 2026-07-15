// Prisma 클라이언트 싱글턴 — 개발 중 핫리로드로 인스턴스가 늘어나는 것 방지.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
