"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

function record(name: "offer_clicked" | "offers_viewed", offerId: string) {
  if (
    navigator.doNotTrack === "1" ||
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  )
    return;
  void fetch("/api/offer-events/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, offerId }),
    keepalive: true,
  }).catch(() => {
    /* Measurement must never prevent navigation. */
  });
}

export function OfferViewEvent({ offerId }: { offerId: string }) {
  const marker = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const element = marker.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        record("offers_viewed", offerId);
        observer.disconnect();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [offerId]);
  return <span ref={marker} aria-hidden="true" />;
}

export function OfferLink({
  offerId,
  href,
  retailer,
  affiliate,
}: {
  offerId: string;
  href: string;
  retailer: string;
  affiliate: boolean;
}) {
  return (
    <a
      className="button secondary"
      href={href}
      target="_blank"
      rel={affiliate ? "sponsored noopener noreferrer" : "noopener noreferrer"}
      onClick={() => record("offer_clicked", offerId)}
    >
      Check price at {retailer} <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  );
}
