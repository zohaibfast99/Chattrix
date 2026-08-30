import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAiMessages, sendAiMessage, clearAiMessages } from "../controllers/ai.controller.js"

const router = express.Router();

router.get("/", protectRoute, getAiMessages);
router.post("/send", protectRoute, sendAiMessage);
router.delete("/", protectRoute, clearAiMessages);

export default router;
