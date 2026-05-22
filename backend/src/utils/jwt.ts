import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env.js";

export function signUserToken(payload: { userId: string }) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });
}

export function signAdminToken(payload: { adminId: string }) {
  return jwt.sign(payload, env.ADMIN_JWT_SECRET, {
    expiresIn: env.ADMIN_JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });
}

export function verifyUserToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { userId: string };
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, env.ADMIN_JWT_SECRET) as { adminId: string };
}
