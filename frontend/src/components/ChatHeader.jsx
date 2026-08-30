import React from "react";
import { ArrowLeft, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";

const ChatHeader = () => {
  const { selectedUser, selectUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
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

      <Avatar user={selectedUser} className="size-10" online={isOnline} />

      <div className="min-w-0 flex-1">
        <h2 className="truncate font-semibold leading-tight tracking-tight">
          {selectedUser.fullName}
        </h2>
        <p className="truncate text-xs text-base-content/50">
          {isOnline ? "Online" : selectedUser.email}
        </p>
      </div>

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
