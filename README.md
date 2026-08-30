# Chattrix

A real-time 1-to-1 chat app built on the MERN stack, with live message delivery over
Socket.IO, online presence, image attachments, and a built-in AI assistant.

<sub>React 19 · Vite · Zustand · Tailwind + daisyUI · Express 5 · MongoDB/Mongoose · Socket.IO · Cloudinary · Groq</sub>

---

## Features

**Accounts** — Email/password signup and login. Passwords are hashed with bcrypt; the
session is a 7-day JWT delivered as an `httpOnly`, `sameSite=strict` cookie, so no token
is ever handled by client JavaScript.

**Direct messaging** — Every other registered user appears in the contact rail, with
search and a live online count. Threads support text, images, or both, and are grouped
under Today / Yesterday / date separators.

**Real time** — Messages arrive instantly over a websocket, and a green dot tracks who is
connected. Multiple tabs of the same account stay in sync with each other.

**Images** — Attachments and profile photos are read as data URLs in the browser (5 MB
cap, validated client-side) and uploaded to Cloudinary from the server; only the resulting
secure URL is stored in Mongo.

**Chattrix AI** — A Groq-backed assistant pinned above the contact list. It is presented
as a pseudo-contact, so it reuses the whole conversation UI rather than a separate screen.
History is per-user and persistent, with a **New chat** button in the header to wipe it.

**Design** — One bespoke daisyUI theme (crimson into burgundy on a red-warmed near-black),
a mobile layout where the list and the conversation take turns, initials-tile avatars for
users with no photo, skeleton loaders, and motion that respects
`prefers-reduced-motion`.

---

## Getting started

### Prerequisites

- Node.js 18+ (the backend uses global `fetch` and `AbortSignal.timeout`)
- A MongoDB database — local or Atlas
- A [Cloudinary](https://cloudinary.com) account (image uploads)
- A [Groq](https://console.groq.com) API key (the AI assistant)

### 1. Configure the backend

```bash
cd backend
cp .env.example .env   # then fill it in
npm install
```

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend port. **Keep `5001`** — see [Ports](#ports). |
| `NODE_ENV` | `development` leaves the session cookie non-`secure` so it works over plain HTTP. |
| `MONGODB_URI` | Connection string, e.g. `mongodb://127.0.0.1:27017/chattrix`. |
| `JWT_SECRET` | Signs session tokens. Rotating it invalidates every existing login. |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Image uploads. |
| `GROQ_API_KEY` | Chattrix AI. Server-side only; never reaches the browser. |

### 2. Run both processes

```bash
cd backend  && npm run dev   # nodemon → http://localhost:5001
cd frontend && npm install && npm run dev   # vite → http://localhost:5173
```

Open <http://localhost:5173> and sign up. Contacts are simply *every other registered
user*, so create a second account in a private window to see messaging and presence work.

### Ports

Both ports are hardcoded in three places and must be changed together:

- `frontend/src/lib/axios.js` → `http://localhost:5001/api`
- `frontend/src/store/useAuthStore.js` → the socket origin
- `backend/src/index.js` and `backend/src/lib/socket.js` → CORS origin `http://localhost:5173`

---

## Architecture

### Backend

```
backend/src/
├─ index.js                  # express wiring, CORS, 10mb JSON body, route mounting
├─ lib/
│  ├─ socket.js              # creates app + http server, io, handshake auth, presence
│  ├─ db.js                  # mongoose connection
│  ├─ utils.js               # signs the JWT and sets the cookie
│  ├─ cloudinary.js          # cloudinary SDK config
│  └─ groq.js                # Groq chat-completions call + system prompt
├─ middleware/auth.middleware.js   # protectRoute: verify cookie → attach req.user
├─ models/                   # User, Message, AiMessage
├─ controllers/              # auth, message, ai
└─ routes/                   # auth, message, ai
```

`index.js` deliberately imports `app` and `server` **from the socket layer** rather than
creating them: Socket.IO must wrap the same HTTP server Express is mounted on, so that
module owns their creation.

### Frontend

```
frontend/src/
├─ App.jsx                   # routes + auth redirects, Toaster
├─ store/                    # zustand: useAuthStore, useChatStore, useAiStore
├─ lib/                      # axios instance, aiContact sentinel, date helpers
├─ pages/                    # Home, Login, SignUp, Profile, Settings
└─ components/               # Sidebar, ChatContainer, ChatHeader, MessageInput,
                             # Navbar, Avatar, AuthAside/AuthField, skeletons
```

Three Zustand stores split by concern: `useAuthStore` owns the session, the socket, and
the online list; `useChatStore` owns contacts and the human thread; `useAiStore` owns the
assistant thread. `HomePage` renders `Sidebar` beside either `ChatContainer` or
`NoChatSelected`.

### Data models

| Model | Fields |
| --- | --- |
| `User` | `email` (unique), `fullName`, `password` (hashed), `profilePic`, timestamps |
| `Message` | `senderId` → User, `receiverId` → User, `text?`, `image?`, timestamps |
| `AiMessage` | `userId` → User (indexed), `role` (`user`/`assistant`), `text`, timestamps |

---

## API

All routes are prefixed `/api`. Everything except signup/login/logout requires the session
cookie via `protectRoute`.

### `/api/auth`

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/signup` | Create an account. Requires all fields, 6+ char password, unused email. Sets the cookie. |
| `POST` | `/login` | Sign in and set the cookie. |
| `POST` | `/logout` | Clear the cookie. |
| `PUT` | `/update-profile` | Body `{ profilePic }` as a data URL → uploaded to Cloudinary. |
| `GET` | `/check` | Returns the current user; how the SPA rehydrates a session on load. |

### `/api/message`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/users` | Every user except the caller (the contact list). |
| `GET` | `/:id` | The full thread between the caller and `:id`, oldest first. |
| `POST` | `/send/:id` | Body `{ text?, image? }`. Persists, emits to both rooms, returns the message. |

### `/api/ai`

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | The caller's assistant history. |
| `POST` | `/send` | Body `{ text }` → `{ userMessage, aiMessage }`. `502` if the model call fails. |
| `DELETE` | `/` | Wipe the caller's assistant history ("New chat"). |

### Socket events

| Event | Direction | Payload |
| --- | --- | --- |
| `onlineUsers` | server → all | Array of connected user ids; broadcast on connect and disconnect. |
| `newMessage` | server → both rooms | The saved message document. |

---

## Design notes

Decisions that are deliberate and easy to "simplify" back into something worse:

**The websocket handshake is authenticated, not asserted.** `io.use` parses the raw
`Cookie` header (cookie-parser is Express middleware and never sees a handshake) and
verifies the same JWT the REST routes use. The common tutorial pattern — passing `userId`
in the handshake query — lets anyone subscribe to another person's messages just by
claiming their id.

**Fan-out uses one Socket.IO room per user id**, so multiple tabs are handled by
Socket.IO itself. The `Map<userId, Set<socketId>>` exists only to derive the presence
list, and a user is offline only once their *last* tab closes.

**`sendMessage` emits to the sender's room too**, keeping their other tabs in sync. Both
the store's POST handler and its socket handler dedupe by `_id`, since the sending tab has
already appended the message from the HTTP response.

**AI turns sort by `{ createdAt: 1, _id: 1 }`.** A question and its answer are written in
the same millisecond, so `createdAt` alone is a non-deterministic tie that can render the
reply *above* the question. The ObjectId's per-process counter breaks it in insertion
order.

**Nothing is persisted until the model answers.** The user's turn is only written
alongside the reply, so a failed Groq call can't strand a question with no answer beside
it — the optimistic bubble is simply rolled back in the store.

**The assistant is a pseudo-contact.** `AI_CONTACT` in `lib/aiContact.js` carries a
sentinel `_id` that never reaches the messages API; components branch on `isAi`. This
buys the entire conversation UI — bubbles, day separators, the mobile back button — for
free.

**Groq model choice.** `openai/gpt-oss-120b` with `reasoning_effort: "low"`. `gpt-oss` is
a reasoning model: at default effort it spends most of the token budget thinking before
answering, which adds latency and can return empty content. Only `content` is ever
persisted or displayed — the `reasoning` field is internal.

**All colour lives in the theme.** No component hardcodes a colour; everything reads
daisyUI semantic tokens (`primary`, `base-100`, …), which is why the whole app re-themes
from one config change. Add colour to `tailwind.config.js`, not to components.

---

## Known gaps

- **`SettingsPage` is a stub**, and its `/settings` route in `App.jsx` is the only one
  with no auth guard.
- **No message pagination** — `GET /api/message/:id` returns the entire thread.
- **Unread state isn't tracked.** A message for a conversation that isn't on screen is
  dropped by the socket handler and only appears on the thread's next load.
- **The contact list is every registered user**; there is no friend/request model.
- The repo root holds a stray `package.json` whose lone `mongodb` dependency nothing uses
  (the backend talks to Mongo through Mongoose).
