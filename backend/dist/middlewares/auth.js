import { verifyAdminToken, verifyUserToken } from "../utils/jwt.js";
export function requireUser(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.replace("Bearer ", "").trim();
    try {
        const payload = verifyUserToken(token);
        req.userId = payload.userId;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
export function requireAdmin(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = header.replace("Bearer ", "").trim();
    try {
        const payload = verifyAdminToken(token);
        req.adminId = payload.adminId;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Invalid token" });
    }
}
