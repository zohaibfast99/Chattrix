import React from "react";
import { MessagesSquare } from "lucide-react";

const NoChatSelected = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-base-100 px-8 text-center">
    <div className="relative">
      <span className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" />
      <span className="relative grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-secondary/15">
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
