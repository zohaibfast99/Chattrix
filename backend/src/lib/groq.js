const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Chosen from what this account actually serves. gpt-oss is a reasoning model:
// without "low" effort it spends most of the token budget thinking before it
// answers, which both slows the reply and can return empty content.
const MODEL = "openai/gpt-oss-120b";
const REASONING_EFFORT = "low";

const SYSTEM_PROMPT =
    "You are Chattrix AI, a helpful assistant built into the Chattrix messaging app. " +
    "Keep replies conversational and concise — a few short paragraphs at most, since " +
    "they are read in chat bubbles. Use plain text; avoid markdown headings and tables.";

/**
 * Sends the conversation to Groq and returns the assistant's reply text.
 * Only `content` is used — the model's `reasoning` field is internal and is
 * never persisted or shown to the user.
 */
export const askGroq = async (history) => {
    if (!process.env.GROQ_API_KEY) {
        throw new Error("GROQ_API_KEY is not configured");
    }

    const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: MODEL,
            reasoning_effort: REASONING_EFFORT,
            max_tokens: 1024,
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        }),
        signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Groq responded ${response.status}: ${detail.slice(0, 200)}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Groq returned an empty completion");

    return text;
};
