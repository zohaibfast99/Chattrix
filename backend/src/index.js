import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors"
import {connectDB} from "./lib/db.js";
// app and server both come from the socket layer: socket.io needs to wrap the same
// http server express is mounted on, so it owns their creation.
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT;

// Base64 image payloads (profile photos, image messages) exceed the 100kb default.
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
    cors({
    origin: "http://localhost:5173",
    credentials:true
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

await connectDB();

server.listen(PORT, () => {
    console.log("Server is running on PORT: " + PORT)
});