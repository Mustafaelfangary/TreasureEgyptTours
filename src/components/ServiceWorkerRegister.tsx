"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "production" &&
      "serviceWorker" in navigator
    ) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
          if (process.env.NODE_ENV === "development") {
            console.log("SW registered:", reg);
          }
        } catch (e) {
          console.warn("SW registration failed:", e);
        }
      };

      const onLoad = () => register();
      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad, { once: true });
      }

      return () => {
        window.removeEventListener("load", onLoad);
      };
    }
  }, []);

  return null;
}
