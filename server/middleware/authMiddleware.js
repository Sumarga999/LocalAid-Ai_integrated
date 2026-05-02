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
    
    // 3. Attach the decoded user data (like their ID) to the request
    req.user = decoded; 
    
    // 4. Move on to the actual route
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid.' });
  }
};

export default authMiddleware;