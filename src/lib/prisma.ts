import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    return process.env.DATABASE_URL;
  }

  // Comprobar si existe en prisma/dev.db o en ./dev.db
  const pathInPrisma = path.join(process.cwd(), "prisma", "dev.db");
  const pathInRoot = path.join(process.cwd(), "dev.db");

  if (fs.existsSync(pathInPrisma)) {
    return `file:${pathInPrisma}`;
  }
  if (fs.existsSync(pathInRoot)) {
    return `file:${pathInRoot}`;
  }

  return `file:${pathInPrisma}`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
