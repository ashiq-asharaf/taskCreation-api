const request = require('supertest');
const express = require('express');
const app = require('./server'); 
const db = require('./db'); 

describe('Task API', () => {
  let token; 

  beforeAll(async () => {
   
    const user = { username: 'testUser', password: 'testPass' };
   
    token = await getTokenForUser(user); 
  });

  afterAll(async () => {
   
    await db.query('DELETE FROM tasks'); 
    await db.query('DELETE FROM users'); 
    db.end(); 
  });

  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      status: 0,
      dueDate: '2024-10-07'
    };

    const response = await request(app)
      .post('/api/v1/tasks/createTasks') 
      .set('x-access-token', token)
      .send(newTask);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Task');
  });

  it('should update an existing task', async () => {
    const taskId = 1; 

    const updatedTask = {
      title: 'Updated Task',
      description: 'This is an updated test task',
      status: 1,
      dueDate: '2024-10-08'
    };

    const response = await request(app)
      .put(`/api/v1/tasks/updateTasks:${taskId}`)
      .set('x-access-token', token)
      .send(updatedTask);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('title', 'Updated Task');
  });

  it('should delete an existing task', async () => {
    const taskId = 1; 

    const response = await request(app)
      .delete(`/api/v1/tasks/deleteTask:${taskId}`)
      .set('x-access-token', token);

    expect(response.statusCode).toBe(204);
  });
});
