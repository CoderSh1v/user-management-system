import "dotenv/config";

import jwt from "jsonwebtoken";

export function jwtAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token Not found"
        });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            role: decoded.userRole
        };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }
}
