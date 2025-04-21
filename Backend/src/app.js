
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorhandler.js';
import fs from 'fs';
import path from 'path';

// Ensure public directory exists
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const app = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

// Express middlewares
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(express.static(publicDir));

// Routes
import userRouter from './routes/user.routes.js';
app.use('/api/v1/users', userRouter);
app.use(errorHandler);

// Increase server timeout for file uploads (30 seconds)
app.serverTimeout = 30000;

export { app };



// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import { errorHandler } from './middlewares/errorhandler.js';
// import fs from 'fs';
// import path from 'path';

// // Ensure public directory exists
// const publicDir = path.join(process.cwd(), 'public');
// if (!fs.existsSync(publicDir)) {
//   fs.mkdirSync(publicDir, { recursive: true });
// }

// const app = express();

// // Middleware setup
// app.use(
//   cors({
//     origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
//     credentials: true,
//   })
// );

// // Express middlewares
// app.use(express.json({ limit: '16kb' }));
// app.use(express.urlencoded({ extended: true, limit: '16kb' }));
// app.use(cookieParser());
// app.use(express.static(publicDir));

// // Routes
// import userRouter from './routes/user.routes.js';
// app.use('/api/v1/users', userRouter);
// app.use(errorHandler);

// export { app };