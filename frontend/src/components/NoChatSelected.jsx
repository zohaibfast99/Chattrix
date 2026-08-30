import React from "react";
import { MessagesSquare } from "lucide-react";

const NoChatSelected = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-base-100 px-8 text-center">
    <div className="relative grid place-items-center">
      {/* A diffuse ember behind the mark. Blurred and slow, so it reads as a
          glow that breathes rather than a ring that pings. */}
      <span className="animate-halo pointer-events-none absolute size-28 rounded-full bg-primary/30 blur-2xl" />
      <span className="relative grid size-16 place-items-center rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg shadow-primary/10">
        <MessagesSquare className="size-8 text-primary" />
      </span>
    </div>
    <div>
      <h2 className="text-xl font-semibold tracking-tight">Welcome to Chattrix</h2>
      <p className="mt-1.5 max-w-xs text-sm text-base-content/60">
        Pick someone from the list to start the conversation.
      </p>
    </div>
  </div>
);

export default NoChatSelected;
