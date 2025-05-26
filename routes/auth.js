const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }
  
  res.status(201).json({ 
    message: 'User registered successfully',
    token: 'sample-token',
    user: { name, email, id: 'temp-id' }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  res.json({ 
    message: 'Login successful',
    token: 'sample-token',
    user: { email, id: 'temp-id', name: 'User' }
  });
});

module.exports = router;
