import jwt from "jsonwebtoken";
import { env } from "./env.js";
export function signUserToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN
    });
}
export function signAdminToken(payload) {
    return jwt.sign(payload, env.ADMIN_JWT_SECRET, {
        expiresIn: env.ADMIN_JWT_EXPIRES_IN
    });
}
export function verifyUserToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
export function verifyAdminToken(token) {
    return jwt.verify(token, env.ADMIN_JWT_SECRET);
}
