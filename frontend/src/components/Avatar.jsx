import React from "react";

const GRADIENTS = [
  "from-primary to-secondary",
  "from-secondary to-accent",
  "from-accent to-primary",
  "from-info to-primary",
  "from-success to-info",
  "from-warning to-error",
];

const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

const pickGradient = (seed = "") => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
};

/**
 * Renders the user's photo, or a deterministic initials tile when they have none,
 * so every contact still reads as a distinct person.
 */
const Avatar = ({ user, className = "size-10", text = "text-sm", ring = false }) => {
  const ringClasses = ring ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-base-100" : "";

  return (
    <div className={`shrink-0 ${className}`}>
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt={user?.fullName || "Profile photo"}
          className={`size-full rounded-full object-cover ${ringClasses}`}
        />
      ) : (
        <div
          className={`grid size-full select-none place-items-center rounded-full bg-gradient-to-br ${pickGradient(
            user?._id || user?.email || ""
          )} font-semibold text-primary-content ${text} ${ringClasses}`}
        >
          {initials(user?.fullName)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
