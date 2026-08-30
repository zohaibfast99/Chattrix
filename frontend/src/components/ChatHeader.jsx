import React from "react";
import { ArrowLeft, Loader2, Trash2, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useAiStore } from "../store/useAiStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, selectUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { messages: aiMessages, clear, isClearing } = useAiStore();

  const isAi = selectedUser.isAi === true;
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <header className="flex items-center gap-3 border-b border-base-300 bg-base-100/80 px-3 py-3 backdrop-blur-xl sm:px-5">
      <button
        onClick={() => selectUser(null)}
        className="btn btn-ghost btn-sm btn-circle sm:hidden"
        aria-label="Back to contacts"
      >
        <ArrowLeft className="size-5" />
      </button>

      <Avatar user={selectedUser} className="size-10" online={!isAi && isOnline} />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold leading-tight tracking-tight">
          {selectedUser.fullName}
        </h2>
        <p className="truncate text-xs text-base-content/50">
          {isAi ? "Always here to help" : isOnline ? "Online" : selectedUser.email}
        </p>
      </div>

      {isAi && (
        <button
          onClick={clear}
          disabled={isClearing || aiMessages.length === 0}
          className="btn btn-ghost btn-sm gap-2 rounded-xl font-medium text-base-content/60 hover:text-error disabled:opacity-40"
          aria-label="Clear this conversation and start a new one"
        >
          {isClearing ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          <span className="hidden sm:inline">New chat</span>
        </button>
      )}

      <button
        onClick={() => selectUser(null)}
        className="btn btn-ghost btn-sm btn-circle hidden text-base-content/50 hover:text-base-content sm:inline-flex"
        aria-label="Close conversation"
      >
        <X className="size-5" />
      </button>
    </header>
  );
};

export default ChatHeader;
