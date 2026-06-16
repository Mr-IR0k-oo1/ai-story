import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  if (!env.DATABASE_URL) return null;
  try {
    const adapter = new PrismaBetterSqlite3({
      url: env.DATABASE_URL,
    });
    return new PrismaClient({ adapter });
  } catch {
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}
