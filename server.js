const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const middleware = require('./middleware');
const morgan = require('morgan');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

const corsOptions = {
  origin: 'http://localhost:3000', 
  allowedHeaders: ['Content-Type', 'X-Access-Token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json());

app.use(morgan('combined'));


io.on('connection', (socket) => {
  console.log('New client connected');

 
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/v1/auth', authRoutes);
app.use('/v1/tasks', taskRoutes(io)); 

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
