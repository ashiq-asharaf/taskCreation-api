const express = require('express');
const db = require('../db');
const authenticateJWT = require('../middleware');
const router = express.Router();

module.exports = (io) => {
  
  router.get('/getTaskDetails', authenticateJWT, async (req, res) => {
    const query = 'SELECT * FROM all_tasks WHERE user_id = $1';
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  });

  
  router.post('/createTasks', authenticateJWT, async (req, res) => {
    const { title, userId,  description, status, dueDate} = req.body;
    const query = 'INSERT INTO all_tasks (title, user_id, description, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await db.query(query, [title, userId, description, status, dueDate]);

    
    io.emit('taskCreated', result.rows[0]);
    
    res.status(201).json(result.rows[0]);
  });

  
  router.put('/updateTasks', authenticateJWT, async (req, res) => {
    const { title, description, dueDate, userId, taskId } = req.body;
    const query = 'UPDATE all_tasks SET title = $1,  description = $2, due_date = $3 WHERE id = $4 AND user_id = $5 RETURNING *';
    const result = await db.query(query, [title, description, dueDate, taskId, userId]);

    if (result.rows.length > 0) {
     
      io.emit('taskUpdated', result.rows[0]);
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Task not found or not authorized' });
    }
  });

  
  router.delete('/deleteTask', authenticateJWT, async (req, res) => {
    
    const { userId, taskId } = req.body;
    const query = 'DELETE FROM all_tasks WHERE id = $1 AND user_id = $2';
    const result = await db.query(query, [taskId, userId]);

    if (result.rowCount > 0) {
      
      io.emit('taskDeleted', taskId);
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Task not found or not authorized' });
    }
  });

  return router;
};
