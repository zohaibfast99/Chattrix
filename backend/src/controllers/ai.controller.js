import AiMessage from "../models/aiMessage.model.js";
import { askGroq } from "../lib/groq.js";

// How much of the conversation is replayed to the model. The full thread stays in
// the database and on screen; this only bounds what each request costs.
const CONTEXT_LIMIT = 20;

export const getAiMessages = async (req, res) => {
    try{
        // A question and its answer are written in the same millisecond, so
        // createdAt alone is a tie and the pair can come back inverted. ObjectIds
        // carry a per-process counter, so _id breaks the tie in insertion order.
        const messages = await AiMessage.find({userId: req.user._id}).sort({createdAt: 1, _id: 1});
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getAiMessages controller ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const sendAiMessage = async (req, res) => {
    try{
        const {text} = req.body;
        const userId = req.user._id;

        if (!text || !text.trim()){
            return res.status(400).json({error: "Message cannot be empty"});
        }
        const prompt = text.trim();

        const recent = await AiMessage.find({userId})
            .sort({createdAt: -1, _id: -1})
            .limit(CONTEXT_LIMIT)
            .lean();

        const history = recent
            .reverse()
            .map(({role, text}) => ({role, content: text}));

        // Nothing is persisted until the model actually answers, so a failed call
        // cannot leave a user message stranded with no reply beside it.
        const reply = await askGroq([...history, {role: "user", content: prompt}]);

        const [userMessage, aiMessage] = await AiMessage.create([
            {userId, role: "user", text: prompt},
            {userId, role: "assistant", text: reply},
        ]);

        res.status(201).json({userMessage, aiMessage});
    }catch(error){
        console.log("Error in sendAiMessage controller ", error.message);
        res.status(502).json({error: "Chattrix AI is unavailable right now"});
    }
};

export const clearAiMessages = async (req, res) => {
    try{
        const {deletedCount} = await AiMessage.deleteMany({userId: req.user._id});
        res.status(200).json({message: "Conversation cleared", deletedCount});
    }catch(error){
        console.log("Error in clearAiMessages controller ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};
