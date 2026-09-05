"use client";

import { useEffect } from "react";
import { CAL_NAMESPACE } from "@/lib/cal";

// React port of the Cal.com "element click" embed snippet. Runs once for the
// whole app (mounted from app/layout.tsx). Cal's own embed.js attaches a
// document-level click listener for any element carrying data-cal-link — see
// lib/cal.ts and components/Button.tsx for the trigger side.
type CalQueueItem = unknown[];
type CalApi = {
  (...args: CalQueueItem): void;
  q: CalQueueItem[];
  ns: Record<string, CalApi>;
  loaded?: boolean;
  config?: Record<string, unknown>;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

export function CalEmbed() {
  useEffect(() => {
    (function (C: Window, A: string, L: string) {
      const p = (a: CalApi, ar: CalQueueItem) => {
        a.q.push(ar);
      };
      const d = C.document;
      C.Cal =
        C.Cal ||
        (function (...ar: CalQueueItem) {
          const cal = C.Cal!;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).setAttribute("src", A);
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = ((...apiArgs: CalQueueItem) => {
              p(api, apiArgs);
            }) as CalApi;
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        } as CalApi);
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal!("init", CAL_NAMESPACE, { origin: "https://app.cal.com" });
    window.Cal!.config = window.Cal!.config || {};
    window.Cal!.config.forwardQueryParams = true;
    window.Cal!.ns[CAL_NAMESPACE]("ui", {
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

  return null;
}
