import React, { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Avatar from "./Avatar";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const Sidebar = () => {
  const { users, selectedUser, isUsersLoading, getUsers, selectUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(term) || user.email?.toLowerCase().includes(term)
    );
  }, [users, query]);

  // onlineUsers carries every connected id including our own, so it is scoped to
  // the people actually in this list before being counted.
  const onlineCount = useMemo(
    () => users.filter((user) => onlineUsers.includes(user._id)).length,
    [users, onlineUsers]
  );

  return (
    <aside
      className={`${
        selectedUser ? "hidden" : "flex"
      } w-full flex-col border-r border-base-300 bg-base-100 sm:flex sm:w-20 lg:w-80`}
    >
      <div className="border-b border-base-300 p-4 lg:p-5">
        <div className="flex items-center gap-2.5">
          <Users className="size-5 shrink-0 text-primary" />
          <h2 className="hidden font-semibold tracking-tight lg:block">Contacts</h2>
          <span className="ml-auto hidden rounded-full bg-base-200 px-2 py-0.5 text-xs font-medium text-base-content/60 lg:block">
            {onlineCount} online
          </span>
        </div>

        <div className="relative mt-4 hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people"
            className="input input-sm input-bordered h-10 w-full rounded-xl bg-base-200/60 pl-9 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="scrollbar-slim flex-1 overflow-y-auto">
        {isUsersLoading ? (
          <SidebarSkeleton />
        ) : filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-base-content/50">
            {users.length === 0 ? "No one else has signed up yet." : "No matches."}
          </p>
        ) : (
          <ul className="space-y-1 p-2 lg:p-3">
            {filtered.map((user) => {
              const isActive = selectedUser?._id === user._id;
              return (
                <li key={user._id}>
                  <button
                    onClick={() => selectUser(user)}
                    className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition ${
                      isActive
                        ? "bg-primary/10 ring-1 ring-primary/25"
                        : "hover:bg-base-200/70 active:bg-base-200"
                    }`}
                  >
                    <Avatar
                      user={user}
                      className="size-11"
                      text="text-sm"
                      ring={isActive}
                      online={onlineUsers.includes(user._id)}
                    />
                    <div className="hidden min-w-0 flex-1 lg:block">
                      <p
                        className={`truncate font-medium ${isActive ? "text-primary" : ""}`}
                      >
                        {user.fullName}
                      </p>
                      <p className="truncate text-sm text-base-content/50">{user.email}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
