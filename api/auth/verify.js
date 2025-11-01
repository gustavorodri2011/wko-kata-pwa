import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'wko-katas-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.status(200).json({
      valid: true,
      user: {
        id: decoded.id,
        username: decoded.username,
        name: decoded.name,
        belt: decoded.belt
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}