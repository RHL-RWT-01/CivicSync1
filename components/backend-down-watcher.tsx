"use client";

import { useEffect } from "react";
import { notifyBackendDown } from "@/lib/backend-down";

/**
 * Patches window.fetch once to watch API calls. When a request to this app's
 * own /api/* routes fails outright (network error) or returns a server error
 * (>= 500 — e.g. the database/cache ran out of credits), it surfaces the
 * shared "backend is napping" toast + console notice. Pass-through otherwise.
 */
export default function BackendDownWatcher() {
  useEffect(() => {
    const w = window as typeof window & { __bdwPatched?: boolean };
    if (w.__bdwPatched) return;
    w.__bdwPatched = true;

    const original = window.fetch.bind(window);

    const isApi = (url: string) => {
      try {
        const u = new URL(url, window.location.origin);
        return u.origin === window.location.origin && u.pathname.startsWith("/api/");
      } catch {
        return false;
      }
    };

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const input = args[0];
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const watched = isApi(url);
      try {
        const res = await original(...args);
        if (watched && res.status >= 500) notifyBackendDown();
        return res;
      } catch (err) {
        if (watched) notifyBackendDown();
        throw err;
      }
    };

    return () => {
      window.fetch = original;
      w.__bdwPatched = false;
    };
  }, []);

  return null;
}
