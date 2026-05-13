import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Check if the frontend sent a token in the headers
  const token = req.header('Authorization')?.split(' ')[1]; // Expects "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    // 2. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the decoded user data to the request
    // FIX: We ensure both 'id' and '_id' are available so your routes don't crash
    req.user = {
      ...decoded,
      _id: decoded._id || decoded.id, 
      id: decoded.id || decoded._id
    }; 
    
    // 4. Move on to the actual route
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export default authMiddleware;