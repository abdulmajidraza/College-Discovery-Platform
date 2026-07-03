const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-secret';
const COOKIE_NAME = 'college_token';

// Simple in-memory users (for demo only)
const users = [];

// Default admin account for demo and college management
const adminPassword = bcrypt.hashSync('Admin123!', 10);
users.push({
  id: 'admin',
  name: 'Admin',
  email: 'admin@college.com',
  password: adminPassword,
  role: 'admin',
  savedColleges: []
});

function loadColleges() {
  const p = path.join(__dirname, 'data', 'colleges.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function saveColleges(colleges) {
  const p = path.join(__dirname, 'data', 'colleges.json');
  fs.writeFileSync(p, JSON.stringify(colleges, null, 2), 'utf8');
}

// Auth endpoints (signup/login/logout)
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please enter all fields' });
    if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const user = { id: `${Date.now()}`, name, email, password: hashed, role: 'user', savedColleges: [] };
    users.push(user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie(COOKIE_NAME, token, { httpOnly: true, sameSite: 'lax' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME] || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = users.find(u => u.id === decoded.userId) || null;
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Admin endpoints
app.get('/api/admin/colleges', authMiddleware, adminMiddleware, (req, res) => {
  try {
    res.json(loadColleges());
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving colleges', error: err.message });
  }
});

app.put('/api/admin/colleges/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const colleges = loadColleges();
    const index = colleges.findIndex(c => c._id === req.params.id || String(c._id) === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'College not found' });

    const updatedCollege = {
      ...colleges[index],
      ...req.body,
      fees: Number(req.body.fees),
      rating: Number(req.body.rating),
      averagePackage: Number(req.body.averagePackage),
      highestPackage: Number(req.body.highestPackage),
      courses: Array.isArray(req.body.courses) ? req.body.courses : colleges[index].courses,
      reviews: Array.isArray(req.body.reviews) ? req.body.reviews : colleges[index].reviews
    };

    colleges[index] = updatedCollege;
    saveColleges(colleges);
    res.json(updatedCollege);
  } catch (err) {
    res.status(500).json({ message: 'Error updating college', error: err.message });
  }
});

app.post('/api/admin/colleges', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const colleges = loadColleges();
    const newCollege = {
      _id: `${Date.now()}`,
      name: req.body.name || 'New College',
      location: req.body.location || 'Unknown',
      category: req.body.category || 'General',
      fees: Number(req.body.fees) || 0,
      rating: Number(req.body.rating) || 0,
      overview: req.body.overview || '',
      placements: req.body.placements || '',
      averagePackage: Number(req.body.averagePackage) || 0,
      highestPackage: Number(req.body.highestPackage) || 0,
      imageUrl: req.body.imageUrl || '',
      courses: Array.isArray(req.body.courses) ? req.body.courses : [],
      reviews: Array.isArray(req.body.reviews) ? req.body.reviews : []
    };

    colleges.push(newCollege);
    saveColleges(colleges);
    res.status(201).json(newCollege);
  } catch (err) {
    res.status(500).json({ message: 'Error creating college', error: err.message });
  }
});

app.delete('/api/admin/colleges/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const colleges = loadColleges();
    const updated = colleges.filter(c => c._id !== req.params.id && String(c._id) !== req.params.id);
    if (updated.length === colleges.length) return res.status(404).json({ message: 'College not found' });
    saveColleges(updated);
    res.json({ message: 'College deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting college', error: err.message });
  }
});

// Colleges endpoints
app.get('/api/colleges', (req, res) => {
  try {
    const { search = '', location = 'All', sort = 'rating' } = req.query;
    let colleges = loadColleges();
    if (search) {
      const q = search.toLowerCase();
      colleges = colleges.filter(c => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || (c.category && c.category.toLowerCase().includes(q)));
    }
    if (location !== 'All') colleges = colleges.filter(c => c.location === location);
    if (sort === 'fees') colleges.sort((a,b)=>a.fees-b.fees);
    else if (sort === 'package') colleges.sort((a,b)=>b.averagePackage-a.averagePackage);
    else colleges.sort((a,b)=>b.rating-a.rating);
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving colleges', error: err.message });
  }
});

app.get('/api/colleges/:id', (req, res) => {
  try {
    const colleges = loadColleges();
    const college = colleges.find(c => c._id === req.params.id || c._id === String(req.params.id));
    if (!college) return res.status(404).json({ message: 'College not found' });
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving college details', error: err.message });
  }
});

app.get('/api/saved', authMiddleware, (req, res) => {
  res.json(req.user.savedColleges || []);
});

app.post('/api/saved', authMiddleware, (req, res) => {
  try {
    const { collegeId } = req.body;
    if (!collegeId) return res.status(400).json({ message: 'College ID is required' });
    const colleges = loadColleges();
    const college = colleges.find(c => c._id === collegeId);
    if (!college) return res.status(404).json({ message: 'College not found' });
    if (!req.user.savedColleges.includes(collegeId)) req.user.savedColleges.push(collegeId);
    res.json({ message: 'College saved successfully', savedColleges: req.user.savedColleges });
  } catch (err) {
    res.status(500).json({ message: 'Error saving college', error: err.message });
  }
});

app.delete('/api/saved', authMiddleware, (req, res) => {
  try {
    const { collegeId } = req.body;
    if (!collegeId) return res.status(400).json({ message: 'College ID is required' });
    req.user.savedColleges = req.user.savedColleges.filter(id => id !== collegeId);
    res.json({ message: 'College removed successfully', savedColleges: req.user.savedColleges });
  } catch (err) {
    res.status(500).json({ message: 'Error removing college', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
