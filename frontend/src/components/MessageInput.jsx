import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImagePlus, Loader2, SendHorizonal, X } from "lucide-react";
import { useAiStore } from "../store/useAiStore";
import { useChatStore } from "../store/useChatStore";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isSending, selectedUser } = useChatStore();
  const { sendMessage: sendAiMessage, isReplying } = useAiStore();

  const isAi = selectedUser?.isAi === true;
  const busy = isAi ? isReplying : isSending;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Images must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed && !(imagePreview && !isAi)) return;

    // The assistant route is text-only, so an attachment never reaches it.
    const sent = isAi
      ? await sendAiMessage(trimmed)
      : await sendMessage({ text: trimmed, image: imagePreview });
    if (sent) {
      setText("");
      clearImage();
    }
  };

  return (
    <div className="border-t border-base-300 bg-base-100 p-3 sm:p-4">
      {imagePreview && !isAi && (
        <div className="animate-pop mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Selected attachment"
              className="size-20 rounded-xl border border-base-300 object-cover"
            />
            <button
              onClick={clearImage}
              type="button"
              className="btn btn-circle btn-xs absolute -right-2 -top-2 border-none bg-base-content text-base-100"
              aria-label="Remove attachment"
            >
              <X className="size-3" />
            </button>
          </div>
          <p className="text-sm text-base-content/50">Image ready to send</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {!isAi && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`btn btn-ghost btn-circle shrink-0 ${
            imagePreview ? "text-primary" : "text-base-content/50"
          } hover:text-primary`}
          aria-label="Attach an image"
        >
          <ImagePlus className="size-5" />
        </button>
        )}

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isAi ? "Ask Chattrix AI…" : "Write a message…"}
          className="input input-bordered h-12 flex-1 rounded-2xl bg-base-200/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        <button
          type="submit"
          disabled={busy || (!text.trim() && !(imagePreview && !isAi))}
          className="btn btn-primary btn-circle size-12 shrink-0 border-none bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
          aria-label="Send message"
        >
          {busy ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <SendHorizonal className="size-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
