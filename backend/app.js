import express, { json } from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import aiRoutes from './routes/ai.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

connect();

const app = express();

const _dirname = path.resolve();

// Cross-Origin Isolation headers
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

const corsOptions = {
    origin: 'https://ai-chat-app-3e0k.onrender.com',
    credentials: true,
}

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/ai' , aiRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use('*', (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend","dist","index.html"));
});

export default app;