import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

export const useAiStore = create((set) => ({
  messages: [],
  isLoading: false,
  isReplying: false,
  isClearing: false,

  getMessages: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/ai");
      set({ messages: res.data });
    } catch (error) {
      toast.error(errorMessage(error, "Could not load your AI chat"));
    } finally {
      set({ isLoading: false });
    }
  },

  sendMessage: async (text) => {
    // The turn is shown immediately under a temporary id; the server persists
    // nothing unless the model actually replies, so a failure rolls it back.
    const pending = { _id: `pending-${Date.now()}`, role: "user", text, createdAt: new Date().toISOString() };
    set((state) => ({ messages: [...state.messages, pending], isReplying: true }));

    try {
      const res = await axiosInstance.post("/ai/send", { text });
      const { userMessage, aiMessage } = res.data;
      set((state) => ({
        messages: [...state.messages.filter((m) => m._id !== pending._id), userMessage, aiMessage],
      }));
      return true;
    } catch (error) {
      set((state) => ({ messages: state.messages.filter((m) => m._id !== pending._id) }));
      toast.error(errorMessage(error, "Chattrix AI could not reply"));
      return false;
    } finally {
      set({ isReplying: false });
    }
  },

  clear: async () => {
    set({ isClearing: true });
    try {
      await axiosInstance.delete("/ai");
      set({ messages: [] });
      toast.success("Started a new chat");
    } catch (error) {
      toast.error(errorMessage(error, "Could not clear the conversation"));
    } finally {
      set({ isClearing: false });
    }
  },

  reset: () => set({ messages: [], isLoading: false, isReplying: false, isClearing: false }),
}));
