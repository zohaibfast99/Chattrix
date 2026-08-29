import React from "react";

const SidebarSkeleton = () => (
  <div className="space-y-1 p-2 lg:p-3">
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 rounded-xl p-2.5">
        <div className="skeleton size-11 shrink-0 rounded-full" />
        <div className="hidden min-w-0 flex-1 space-y-2 lg:block">
          <div className="skeleton h-3.5 w-28 rounded" />
          <div className="skeleton h-3 w-40 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default SidebarSkeleton;
