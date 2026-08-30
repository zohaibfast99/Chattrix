import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSending: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(errorMessage(error, "Could not load your contacts"));
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      // Guard against a slow response for a chat the user has already navigated away from.
      if (get().selectedUser?._id !== userId) return;
      set({ messages: res.data });
    } catch (error) {
      toast.error(errorMessage(error, "Could not load this conversation"));
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async ({ text, image }) => {
    const { selectedUser } = get();
    if (!selectedUser) return false;

    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, { text, image });
      // Read the list at set-time rather than closing over it: inbound socket
      // messages can land mid-request, and a stale copy would drop them. The
      // guard covers this message's own echo winning the race with the response.
      set((state) =>
        state.messages.some((existing) => existing._id === res.data._id)
          ? state
          : { messages: [...state.messages, res.data] }
      );
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Message failed to send"));
      return false;
    } finally {
      set({ isSending: false });
    }
  },

  selectUser: (user) => set({ selectedUser: user }),

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    // Re-subscribing on every selectedUser change would stack handlers, so the
    // previous one is always cleared first.
    socket.off("newMessage");
    socket.on("newMessage", (message) => {
      const { selectedUser, messages } = get();
      const authUserId = useAuthStore.getState().authUser?._id;

      // The server echoes to the sender's room as well, so a tab that already
      // appended this message from the POST response must not append it twice.
      if (messages.some((existing) => existing._id === message._id)) return;

      // Only messages belonging to the conversation on screen. Anything else is a
      // different thread, which the sidebar surfaces on its next load.
      const belongsHere =
        (message.senderId === selectedUser?._id && message.receiverId === authUserId) ||
        (message.senderId === authUserId && message.receiverId === selectedUser?._id);
      if (!belongsHere) return;

      set({ messages: [...messages, message] });
    });
  },

  unsubscribeFromMessages: () => {
    useAuthStore.getState().socket?.off("newMessage");
  },

  reset: () => set({ users: [], messages: [], selectedUser: null }),
}))
