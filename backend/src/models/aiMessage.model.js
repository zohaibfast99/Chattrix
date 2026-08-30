import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema(
    {
        // The conversation is private to one user: there is no second participant,
        // so a single owner id is all the scoping this needs.
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);
const AiMessage = mongoose.model("AiMessage", aiMessageSchema);
export default AiMessage;
