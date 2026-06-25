import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { startRentReminder } from './utils/rentReminder.js';
import adminRoutes from './routes/admin.routes.js';

// Routes
import authRoutes from './routes/auth.routes.js';
import listingRoutes from './routes/listing.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import expenseRoutes from './routes/expense.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import reviewRoutes from './routes/review.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app); // wrap express in http server for Socket.IO
const PORT = process.env.PORT || 5000;

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
});

// Store io instance on app so controllers can use it
app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins their personal room
  socket.on('join', (userId) => {
    socket.join(`student_${userId}`);
    socket.join(`landlord_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rentmate-seven.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Start server
httpServer.listen(PORT, () => {
  connectDB();
  startRentReminder();
  console.log(`Server running on port ${PORT}`);
});