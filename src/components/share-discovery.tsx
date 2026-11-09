"use client";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { discoveryReturn } from "@/lib/discovery-context";
import { useClientReady } from "@/lib/use-client-ready";

export function ShareDiscovery({ href }: { href: string }) {
  const ready = useClientReady();
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState("");
  return (
    <div className="share-discovery">
      <button
        className="button secondary"
        type="button"
        disabled={!ready}
        onClick={async () => {
          const safe = discoveryReturn(href);
          if (!safe) return;
          const url = new URL(safe, window.location.origin).href;
          try {
            await navigator.clipboard.writeText(url);
            setMessage("Link copied.");
            setFallback("");
            track("discovery_shared", { source: "discovery" });
          } catch {
            setFallback(url);
            setMessage("Copy the link below to share this view.");
          }
        }}
      >
        Share this view
      </button>
      <span role="status">{message}</span>
      <noscript>
        Share this view by copying its address from your browser.
      </noscript>
      {fallback && (
        <label>
          Link to this view
          <input
            readOnly
            value={fallback}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}
