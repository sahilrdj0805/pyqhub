import jwt from "jsonwebtoken";

// ===============================
// PROTECT ROUTES (JWT REQUIRED)
// ===============================
export const protect = (req, res, next) => {
  try {
    let token;

    // 1. Try httpOnly cookie first (preferred, secure)
    if (req.cookies && req.cookies.pyq_token) {
      token = req.cookies.pyq_token;
    }
    // 2. Fallback to Authorization header (for API clients / Postman)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded data to request
    req.user = decoded; // { id, role }

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token"
    });
  }
};

// ===============================
// ADMIN ONLY
// ===============================
export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};
