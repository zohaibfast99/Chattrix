import React from "react";
import { Sparkles } from "lucide-react";

const PREVIEW = [
  { mine: false, text: "have you tried Chattrix yet?" },
  { mine: true, text: "just signed up — it's gorgeous" },
  { mine: false, text: "wait till you see it on your phone" },
  { mine: true, text: "shipping this weekend then 🚀" },
];

/**
 * Decorative half of the auth screens: soft gradient field behind a short
 * scripted conversation that animates in, so the product sells itself.
 */
const AuthAside = ({ title, subtitle }) => (
  <aside className="relative hidden overflow-hidden bg-gradient-to-r from-base-100 via-base-200 to-base-200 lg:flex lg:flex-col lg:justify-center">
    <div className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-primary/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-20 size-96 rounded-full bg-secondary/20 blur-3xl" />
    <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(hsl(var(--bc))_1px,transparent_1px)] [background-size:22px_22px]" />

    {/* Feathered seam. The column edge is otherwise a hard step from base-100 to
        base-200, with overflow-hidden slicing the glow flat along the same line.
        This strip blurs whatever sits under it and fades that blur out to the
        right, so the two halves dissolve together instead of butting up. */}
    <div className="pointer-events-none absolute inset-y-0 -left-px w-48 bg-gradient-to-r from-base-100 via-base-100/60 to-transparent backdrop-blur-2xl [mask-image:linear-gradient(to_right,black_25%,transparent)]" />

    <div className="relative z-10 mx-auto w-full max-w-md px-12">
      <span className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-100/70 px-3 py-1 text-xs font-medium text-base-content/70 backdrop-blur">
        <Sparkles className="size-3.5 text-primary" />
        Conversations, beautifully simple
      </span>

      <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight">{title}</h2>
      <p className="mt-3 text-base-content/60">{subtitle}</p>

      <div className="mt-10 space-y-3">
        {PREVIEW.map((bubble, i) => (
          <div
            key={bubble.text}
            className={`animate-rise flex ${bubble.mine ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${250 + i * 260}ms` }}
          >
            <p
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                bubble.mine
                  ? "rounded-br-md bg-primary text-primary-content"
                  : "rounded-bl-md border border-base-300 bg-base-100"
              }`}
            >
              {bubble.text}
            </p>
          </div>
        ))}

        <div className="animate-rise flex justify-start" style={{ animationDelay: "1290ms" }}>
          <span className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-1.5 animate-bounce rounded-full bg-base-content/40"
                style={{ animationDelay: `${dot * 140}ms` }}
              />
            ))}
          </span>
        </div>
      </div>
    </div>
  </aside>
);

export default AuthAside;
