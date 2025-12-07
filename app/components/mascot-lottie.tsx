"use client";

import React, { useEffect, useState } from "react";

const LOTTIE_SRC = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
const MASCOTS = ["/a.lottie", "/b.lottie", "/c.lottie"] as const;

export function MascotLottie() {
  const [src, setSrc] = useState<string | null>(null);

  // Load the Lottie web component script once.
  useEffect(() => {
    if (document.querySelector(`script[src="${LOTTIE_SRC}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = LOTTIE_SRC;
    document.head.appendChild(script);
  }, []);

  // Choose a mascot client-side to avoid hydration mismatch.
  useEffect(() => {
    const choice = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
    setSrc(choice);
  }, []);

  if (!src) return null;

  return (
    <div className="relative mx-auto flex max-w-sm items-center justify-center">
      <dotlottie-player
        src={src}
        autoplay
        loop
        speed="1"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string;
        autoplay?: boolean;
        loop?: boolean;
        speed?: string;
      };
    }
  }
}
