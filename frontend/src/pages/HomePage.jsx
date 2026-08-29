import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-[calc(100dvh-4rem)] bg-base-200/50">
      <div className="mx-auto h-full max-w-7xl sm:p-4 lg:p-6">
        <div className="flex h-full overflow-hidden border-base-300 bg-base-100 shadow-xl sm:rounded-3xl sm:border">
          <Sidebar />

          {/* On mobile the list and the conversation take turns; from sm up they sit side by side. */}
          <div className={`${selectedUser ? "flex" : "hidden"} min-w-0 flex-1 sm:flex`}>
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
