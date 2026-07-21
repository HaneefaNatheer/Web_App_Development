const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Token missing."
        });
    }

    try {

        const decoded = jwt.verify(token, "secretKey");

        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid token."
        });

    }

}

module.exports = verifyToken;