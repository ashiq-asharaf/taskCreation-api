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

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/tasks', taskRoutes(io)); // Pass the io instance to task routes

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
