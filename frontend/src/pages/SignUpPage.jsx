import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail, MessagesSquare, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import AuthAside from "../components/AuthAside";
import AuthField from "../components/AuthField";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return "Please enter your full name";
    if (!formData.email.trim()) return "Please enter your email";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "That email doesn't look right";
    if (!formData.password) return "Please choose a password";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) return toast.error(error);

    await signup({ ...formData, fullName: formData.fullName.trim(), email: formData.email.trim() });
  };

  return (
    <div className="grid min-h-[calc(100dvh-4rem)] lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md animate-pop">
          <div className="mb-9 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
              <MessagesSquare className="size-7 text-primary-content" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-base-content/60">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthField
              label="Full name"
              icon={User}
              type="text"
              placeholder="Jane Cooper"
              autoComplete="name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
              disabled={isSigningUp}
              className="btn btn-primary h-12 w-full rounded-xl border-none bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-70"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <AuthAside
        title="Start the conversation."
        subtitle="Chattrix keeps every thread in one calm, fast place — on any device you pick up."
      />
    </div>
  );
};

export default SignUpPage;
