const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret"
      );

      // Add user ID to request object
      req.user = { id: decoded.id };

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

// Grant access to specific roles
exports.admin = (req, res, next) => {
  // req.user is already set by the 'protect' middleware
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: "Not authorized as an admin" 
    });
  }
};