import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { axiosInstance } from "../lib/axios.js";
import { useChatStore } from "./useChatStore.js";

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.response?.data?.error || fallback;

// The socket shares the API origin so the httpOnly jwt cookie rides along on the
// handshake — the server authenticates from that, nothing is passed in a query.
const SOCKET_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  socket: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch {
      // A 401 here is the normal "not logged in yet" path, not a failure worth surfacing.
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Welcome to Chattrix");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not create your account"));
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Welcome back");
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not sign you in"));
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null });
      useChatStore.getState().reset();
      toast.success("Signed out");
    } catch (error) {
      toast.error(errorMessage(error, "Could not sign you out"));
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile photo updated");
    } catch (error) {
      toast.error(errorMessage(error, "Could not update your photo"));
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    // checkAuth/login can both land here; never stack a second connection.
    if (get().socket?.connected) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    set({ socket });

    socket.on("onlineUsers", (userIds) => set({ onlineUsers: userIds }));
    socket.on("connect_error", (error) => {
      // An "Unauthorized" here means the cookie is gone or expired; the REST
      // layer will bounce the user to /login on its own, so stay quiet.
      if (error.message !== "Unauthorized") console.warn("Socket error:", error.message);
    });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));
