import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Camera, Loader2, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Avatar from "../components/Avatar";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Please pick an image file");
    if (file.size > MAX_IMAGE_BYTES) return toast.error("Images must be under 5MB");

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPreview(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const joined = authUser?.createdAt
    ? new Date(authUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-base-200/50 px-4 py-10">
      <div className="animate-pop mx-auto max-w-xl overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-xl">
        <div className="h-28 bg-gradient-to-r from-primary to-secondary" />

        <div className="px-6 pb-8 sm:px-8">
          <div className="-mt-14 flex flex-col items-center">
            <div className="relative">
              <div className="rounded-full ring-4 ring-base-100">
                <Avatar
                  user={preview ? { ...authUser, profilePic: preview } : authUser}
                  className="size-28"
                  text="text-3xl"
                />
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUpdatingProfile}
                className="btn btn-circle btn-sm absolute bottom-1 right-1 border-none bg-base-content text-base-100 shadow-lg hover:brightness-125"
                aria-label="Change profile photo"
              >
                {isUpdatingProfile ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">{authUser?.fullName}</h1>
            <p className="mt-1 text-sm text-base-content/50">
              {isUpdatingProfile ? "Uploading your photo…" : "Tap the camera to change your photo"}
            </p>
          </div>

          <dl className="mt-8 space-y-3">
            <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 px-4 py-3">
              <User className="size-4 shrink-0 text-base-content/40" />
              <dt className="text-sm text-base-content/50">Full name</dt>
              <dd className="ml-auto truncate font-medium">{authUser?.fullName}</dd>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-base-300 bg-base-200/40 px-4 py-3">
              <Mail className="size-4 shrink-0 text-base-content/40" />
              <dt className="text-sm text-base-content/50">Email</dt>
              <dd className="ml-auto truncate font-medium">{authUser?.email}</dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-5 text-sm">
            <span className="text-base-content/50">Member since</span>
            <span className="font-medium">{joined}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
