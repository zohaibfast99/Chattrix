import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, MessagesSquare, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "./Avatar";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-base-300 bg-base-100/80 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-sm shadow-primary/25 transition-transform group-hover:scale-105">
            <MessagesSquare className="size-5 text-primary-content" />
          </span>
          <span className="text-lg font-bold tracking-tight">Chattrix</span>
        </Link>

        {authUser && (
          <div className="flex items-center gap-1.5">
            <Link
              to="/profile"
              className="btn btn-ghost btn-sm gap-2 rounded-xl font-medium"
            >
              <Avatar user={authUser} className="size-6" text="text-[10px]" />
              <span className="hidden max-w-[10rem] truncate sm:inline">
                {authUser.fullName}
              </span>
              <User className="size-4 sm:hidden" />
            </Link>

            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm gap-2 rounded-xl font-medium text-base-content/70 hover:text-error"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
