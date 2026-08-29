import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

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
    const { selectedUser, messages } = get();
    if (!selectedUser) return false;

    set({ isSending: true });
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, { text, image });
      set({ messages: [...messages, res.data] });
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Message failed to send"));
      return false;
    } finally {
      set({ isSending: false });
    }
  },

  selectUser: (user) => set({ selectedUser: user }),

  reset: () => set({ users: [], messages: [], selectedUser: null }),

  // Sockets land here later: a subscribeToMessages()/unsubscribe pair that
  // appends inbound messages to `messages` when they match `selectedUser`.
}))
