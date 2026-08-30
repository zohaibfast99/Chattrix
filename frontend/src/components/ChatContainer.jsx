import React, { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAiStore } from "../store/useAiStore";
import { useChatStore } from "../store/useChatStore";
import { formatDayLabel, formatMessageTime, startsNewDay } from "../lib/utils";
import Avatar from "./Avatar";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    isMessagesLoading,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const {
    messages: aiMessages,
    isLoading: isAiLoading,
    isReplying,
    getMessages: getAiMessages,
  } = useAiStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  const isAi = selectedUser?.isAi === true;
  const thread = isAi ? aiMessages : messages;
  const isThreadLoading = isAi ? isAiLoading : isMessagesLoading;

  useEffect(() => {
    if (!selectedUser?._id) return;

    // The assistant thread is private and fetched over its own route; the socket
    // subscription only concerns messages between two people.
    if (isAi) {
      getAiMessages();
      return;
    }

    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    isAi,
    getMessages,
    getAiMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread, isReplying]);

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-base-100">
      <ChatHeader />

      <div className="scrollbar-slim flex-1 overflow-y-auto">
        {isThreadLoading ? (
          <MessageSkeleton />
        ) : thread.length === 0 ? (
          <div className="flex h-full items-center justify-center px-8 text-center">
            <p className="max-w-xs text-sm text-base-content/50">
              {isAi ? (
                "Ask Chattrix AI anything — it remembers this conversation until you start a new one."
              ) : (
                <>
                  This is the beginning of your conversation with{" "}
                  <span className="font-medium text-base-content/70">
                    {selectedUser.fullName.split(" ")[0]}
                  </span>
                  . Say hello.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-1.5 p-4 sm:p-6">
            {thread.map((message, i) => {
              // AI turns carry a role instead of participant ids.
              const isMine = isAi ? message.role === "user" : message.senderId === authUser._id;
              const author = isMine ? authUser : selectedUser;

              return (
                <React.Fragment key={message._id}>
                  {startsNewDay(message, thread[i - 1]) && (
                    <div className="flex items-center gap-3 py-4">
                      <span className="h-px flex-1 bg-base-300" />
                      <span className="text-xs font-medium text-base-content/40">
                        {formatDayLabel(message.createdAt)}
                      </span>
                      <span className="h-px flex-1 bg-base-300" />
                    </div>
                  )}

                  <div
                    className={`animate-pop flex items-end gap-2 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMine && <Avatar user={author} className="size-8" text="text-[11px]" />}

                    <div
                      className={`max-w-[78%] space-y-1.5 rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[65%] ${
                        isMine
                          ? "rounded-br-md bg-primary text-primary-content"
                          : "rounded-bl-md border border-base-300 bg-base-200/70"
                      }`}
                    >
                      {message.image && (
                        <a href={message.image} target="_blank" rel="noreferrer">
                          <img
                            src={message.image}
                            alt="Attachment"
                            className="max-h-72 w-full rounded-xl object-cover"
                          />
                        </a>
                      )}

                      {message.text && (
                        <p className="whitespace-pre-wrap break-words leading-relaxed">
                          {message.text}
                        </p>
                      )}

                      <time
                        className={`block text-right text-[10px] tabular-nums ${
                          isMine ? "text-primary-content/70" : "text-base-content/40"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </time>
                    </div>

                    {isMine && <Avatar user={author} className="size-8" text="text-[11px]" />}
                  </div>
                </React.Fragment>
              );
            })}
            {isAi && isReplying && (
              <div className="animate-pop flex items-end gap-2 justify-start">
                <Avatar user={selectedUser} className="size-8" text="text-[11px]" />
                <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-base-300 bg-base-200/70 px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      className="size-1.5 animate-bounce rounded-full bg-base-content/40"
                      style={{ animationDelay: `${dot * 140}ms` }}
                    />
                  ))}
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </section>
  );
};

export default ChatContainer;
