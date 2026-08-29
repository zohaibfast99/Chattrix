import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthAside from "../components/AuthAside";
import AuthField from "../components/AuthField";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return toast.error("Please enter your email");
    if (!formData.password) return toast.error("Please enter your password");

    await login({ ...formData, email: formData.email.trim() });
  };

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md animate-pop">
          <div className="mb-9 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
              <MessagesSquare className="size-7 text-primary-content" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-2 text-base-content/60">Sign in to pick up where you left off.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthField
              label="Email"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <AuthField
              label="Password"
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="btn btn-ghost btn-sm rounded-lg text-base-content/40 hover:text-base-content"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary h-12 w-full rounded-xl border-none bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-base-content/60">
            New to Chattrix?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      <AuthAside
        title="Welcome back to the thread."
        subtitle="Your conversations are exactly where you left them — nothing to catch up on."
      />
    </div>
  );
};

export default LoginPage;
