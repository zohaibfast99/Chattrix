/**
 * The assistant is presented as a contact so it can reuse the whole conversation
 * UI — bubbles, day separators, the mobile back button — without a parallel
 * screen. The id is a sentinel and never reaches the messages API; AI turns go to
 * /api/ai instead, which scopes them to the logged-in user server-side.
 */
export const AI_CONTACT = {
  _id: "__chattrix_ai__",
  fullName: "Chattrix AI",
  email: "Always here to help",
  isAi: true,
};
