import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

// cookie-parser is Express middleware and never sees the websocket handshake, so
// the raw Cookie header is parsed by hand here.
const parseCookies = (header = "") =>
    Object.fromEntries(
        header
            .split(";")
            .map((pair) => {
                const eq = pair.indexOf("=");
                if (eq === -1) return null;
                try {
                    return [
                        decodeURIComponent(pair.slice(0, eq).trim()),
                        decodeURIComponent(pair.slice(eq + 1).trim()),
                    ];
                } catch {
                    return null;
                }
            })
            .filter(Boolean)
    );

// The handshake carries the same httpOnly jwt cookie the REST routes use. Trusting
// a client-supplied userId here would let anyone subscribe to another person's
// messages simply by claiming their id, so the token is verified instead.
io.use((socket, next) => {
    try {
        const { jwt: token } = parseCookies(socket.handshake.headers.cookie);
        if (!token) return next(new Error("Unauthorized"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.userId) return next(new Error("Unauthorized"));

        socket.userId = String(decoded.userId);
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

// userId -> set of live socket ids. Only used to derive the presence list; message
// fan-out goes through a room per user so extra tabs are handled by socket.io.
const userSockets = new Map();

const onlineUserIds = () => [...userSockets.keys()];

io.on("connection", (socket) => {
    const { userId } = socket;

    socket.join(userId);
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId).add(socket.id);

    io.emit("onlineUsers", onlineUserIds());

    socket.on("disconnect", () => {
        const sockets = userSockets.get(userId);
        if (sockets) {
            sockets.delete(socket.id);
            // Only really offline once the last tab goes.
            if (sockets.size === 0) userSockets.delete(userId);
        }
        io.emit("onlineUsers", onlineUserIds());
    });
});

export { app, server };
