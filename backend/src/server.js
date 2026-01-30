require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIo = require('socket.io');
const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const labelRoutes = require('./routes/labelRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Make io accessible to controllers
app.set('io', io);

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Join admin room for label updates
  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('👤 Admin joined room:', socket.id);
  });
});

// Middleware to emit label updates via Socket.io
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    // Emit label update event if this is a label update
    if (req.method === 'PUT' && req.path.startsWith('/api/labels/') && data.success) {
      const io = req.app.get('io');
      io.emit('label-updated', data.data);
      console.log('📡 Label update broadcasted');
    }
    return originalJson.call(this, data);
  };
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('========================================');
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time updates`);
  console.log('========================================');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
