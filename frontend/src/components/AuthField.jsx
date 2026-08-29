import React from "react";

/** Labelled input with a leading icon and an optional trailing control. */
const AuthField = ({ label, icon, trailing, ...inputProps }) => {
  const Icon = icon;

  return (
    <label className="form-control w-full">
      <div className="label pb-1.5">
        <span className="label-text text-sm font-medium">{label}</span>
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-base-content/40" />
        <input
          {...inputProps}
          className={`input input-bordered h-12 w-full rounded-xl bg-base-100 pl-11 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            trailing ? "pr-11" : ""
          }`}
        />
        {trailing && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>
    </label>
  );
};

export default AuthField;
