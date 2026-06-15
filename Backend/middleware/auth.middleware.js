import jwt from 'jsonwebtoken';

// Checks if user is logged in
export const protectRoute = (req, res, next) => {
  try {
    const token = req.cookies.rentmate_token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role }
    next();

  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Checks if user has the right role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};