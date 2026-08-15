import { toast } from "sonner";

// Shared "backend is offline" notice — same copy across all of Rahul's project frontends.
export const BACKEND_DOWN_TITLE = "😴 Backend's taking a nap";
export const BACKEND_DOWN_BODY =
  "The server is hosted on a free tier that ran out of credits — for obvious reasons (solo dev, $0 budget). The frontend is fully real; the backend just clocked out. Ping Rahul and it'll be back up.";

let lastShown = 0;

/** Fire the toast + console notice, throttled so a burst of failed calls only shows it once. */
export function notifyBackendDown() {
  if (typeof window === "undefined") return;
  const now = Date.now();
  if (now - lastShown < 90_000) return;
  lastShown = now;

  console.log(
    `%c${BACKEND_DOWN_TITLE}`,
    "font-size:14px;font-weight:700;color:#a98bf0;padding:2px 0;"
  );
  console.log(`%c${BACKEND_DOWN_BODY}`, "color:#8a93a6;line-height:1.5;");

  toast(BACKEND_DOWN_TITLE, {
    description: BACKEND_DOWN_BODY,
    duration: 9000,
  });
}
