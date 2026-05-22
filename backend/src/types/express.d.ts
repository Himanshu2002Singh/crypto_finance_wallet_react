import type { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    adminId?: string;
  }
}

export type AuthedRequest = Request & {
  userId?: string;
  adminId?: string;
};
