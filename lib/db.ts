import { PrismaClient } from "../generated/prisma";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prisma: PrismaClient;

if (typeof window === "undefined") {
  // SQLite URL resolving to process.cwd() + prisma/dev.db
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const adapter = new PrismaBetterSqlite3({
    url: `file:${dbPath}`,
  });

  prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }
} else {
  // Prevent build errors or crashes if db is imported in a client-side bundle
  prisma = null as any;
}

export const db = prisma;
