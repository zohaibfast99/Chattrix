import React from "react";

const WIDTHS = ["w-40", "w-56", "w-32", "w-64", "w-44", "w-36"];

const MessageSkeleton = () => (
  <div className="space-y-4 p-4 sm:p-6">
    {WIDTHS.map((width, i) => (
      <div key={i} className={`flex items-end gap-2 ${i % 2 ? "justify-end" : "justify-start"}`}>
        {i % 2 === 0 && <div className="skeleton size-8 shrink-0 rounded-full" />}
        <div className={`skeleton h-11 ${width} max-w-[70%] rounded-2xl`} />
      </div>
    ))}
  </div>
);

export default MessageSkeleton;
