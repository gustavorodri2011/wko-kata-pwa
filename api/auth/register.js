import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByUsername, createUser } from '../database/sqlite.js';

const JWT_SECRET = process.env.JWT_SECRET || 'wko-katas-secret-key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password, name, belt, adminToken } = req.body;

    if (!username || !password || !name || !belt) {
      return res.status(400).json({ error: 'All fields required' });
    }

    // Verify admin token
    if (!adminToken) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    try {
      const decoded = jwt.verify(adminToken, JWT_SECRET);
      if (decoded.belt !== 'Negro 4to DAN') {
        return res.status(403).json({ error: 'Admin privileges required' });
      }
    } catch {
      return res.status(403).json({ error: 'Invalid admin token' });
    }

    // Check if username exists
    const existingUser = getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    
    const newUser = createUser({
      username,
      password: hashedPassword,
      name,
      belt
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}