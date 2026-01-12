import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { connection } from './config/db.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js"
import TaskRoutes from "./routes/task.routes.js"
import AdminRoutes from "./routes/admin.routes.js"

const app = express();

config({path : "./.env"});

app.use(express.json());
app.use(cookieParser());

app.use(cors({
     origin:  "http://localhost:5173",
     methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
})
);

connection()

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/task", TaskRoutes);
app.use("/api/v1/admin", AdminRoutes);

export default app;