const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();


router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  
  const emailQuery = 'SELECT * FROM member_details WHERE email = $1';
  const emailResult = await db.query(emailQuery, [email]);

  if (emailResult.rows.length > 0) {
    return res.status(200).json({
      statusCode: 2,
      statusMessage: 'Email already exists',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO member_details (email, password) VALUES ($1, $2) RETURNING *';
  await db.query(query, [email, hashedPassword]);

  res.status(200).json({
    statusCode: 1,
    statusMessage: 'User created successfully',
  });
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const query = 'SELECT * FROM member_details WHERE email = $1';
    const result = await db.query(query, [email]);
  
    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        return res.status(200).json({
          statusCode: 1,
          statusMessage: 'Login successful',
          accessToken: token,
          userId: user.id, 
        });
      } else {
        return res.status(200).json({
          statusCode: 2,
          statusMessage: 'Invalid credentials',
        });
      }
    } else {
      return res.status(200).json({
        statusCode: 2,
        statusMessage: 'User not found',
      });
    }
  });

module.exports = router;
