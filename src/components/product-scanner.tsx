"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, ScanLine } from "lucide-react";
import type { IScannerControls } from "@zxing/browser";
import type { Product } from "@/lib/data";
import { resolveProductCode } from "@/lib/product-codes";

// Intent: a shopper chooses when to use the camera; the quiet paper dialog
// contains one viewfinder, clear actions and a manual exit. Existing DM Sans,
// petroleum/mineral tokens, border-only depth and 4px spacing match the reader.
export function ProductScanner({
  onMatch,
  onSearch,
  onClose,
}: {
  onMatch: (product: Product) => void;
  onSearch: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const controls = useRef<IScannerControls | null>(null);
  const generation = useRef(0);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "Use a Peptivelo product QR. Manufacturer barcodes are not supported yet.",
  );
  const [code, setCode] = useState("");
  function stop() {
    generation.current++;
    controls.current?.stop();
    controls.current = null;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
  }
  useEffect(() => {
    dialog.current?.showModal();
    function hide() {
      if (document.hidden) {
        stop();
        setActive(false);
        setBusy(false);
        setMessage("Camera paused. Choose Start camera to continue.");
      }
    }
    document.addEventListener("visibilitychange", hide);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", hide);
    };
  }, []);
  function lookup(value: string) {
    stop();
    setActive(false);
    setBusy(false);
    const product = resolveProductCode(value, window.location.origin);
    if (product) {
      dialog.current?.close();
      onMatch(product);
      return;
    }
    setMessage(
      "Code read, but no catalog match. Search by product name to continue. This does not mean the product is fake.",
    );
  }
  async function start() {
    stop();
    const attempt = generation.current;
    setBusy(true);
    setMessage(
      "Waiting for camera permission… You can close this window at any time.",
    );
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia)
        throw new Error("unsupported");
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      if (attempt !== generation.current) return;
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      if (attempt !== generation.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = media;
      setActive(true);
      setBusy(false);
      setMessage(
        "Hold the code steady inside the frame. Add light or move a little farther away if needed.",
      );
      const scan = await new BrowserMultiFormatReader().decodeFromStream(
        media,
        video.current!,
        (result, _error, callbackControls) => {
          if (result && attempt === generation.current) {
            callbackControls.stop();
            lookup(result.getText());
          }
        },
      );
      if (attempt !== generation.current) scan.stop();
      else controls.current = scan;
    } catch (error) {
      if (attempt !== generation.current) return;
      stop();
      setActive(false);
      setBusy(false);
      const name = error instanceof Error ? error.name : "";
      setMessage(
        name === "NotAllowedError"
          ? "Camera permission was not granted. You can choose an image or search by name."
          : name === "NotFoundError"
            ? "No camera was found. Choose an image or search by name."
            : "Camera could not start. Use HTTPS or localhost, check camera access, or choose an image instead.",
      );
    }
  }
  async function readImage(file?: File) {
    if (!file) return;
    stop();
    setActive(false);
    if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
      setBusy(false);
      setMessage("Choose an image smaller than 10 MB.");
      return;
    }
    const attempt = generation.current;
    setBusy(true);
    setMessage("Reading the code in your image…");
    const url = URL.createObjectURL(file);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      if (attempt !== generation.current) return;
      const result = await new BrowserMultiFormatReader().decodeFromImageUrl(
        url,
      );
      if (attempt === generation.current) lookup(result.getText());
    } catch {
      if (attempt === generation.current) {
        setBusy(false);
        setMessage(
          "No readable code found. Try a sharp, well-lit image of the whole code, or search by name.",
        );
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="scanner-dialog"
      aria-labelledby="scanner-title"
      onCancel={(event) => {
        event.preventDefault();
        stop();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          stop();
          onClose();
        }
      }}
    >
      <div className="scanner-heading">
        <div>
          <span className="eyebrow">FIND YOUR SERUM</span>
          <h2 id="scanner-title">Scan a Peptivelo QR</h2>
        </div>
        <button
          className="scanner-close"
          aria-label="Close scanner"
          onClick={() => {
            stop();
            onClose();
          }}
        >
          <X size={20} />
        </button>
      </div>
      <div className={`scanner-view ${active ? "is-active" : ""}`}>
        <video
          ref={video}
          muted
          playsInline
          aria-label="Camera preview"
          hidden={!active}
        />
        {!active && (
          <div>
            <ScanLine size={40} aria-hidden="true" />
            <span>Peptivelo QR reader</span>
          </div>
        )}
      </div>
      <p className="scanner-message" role="status">
        {message}
      </p>
      <div className="scanner-actions">
        {active ? (
          <button
            className="button secondary"
            onClick={() => {
              stop();
              setActive(false);
              setBusy(false);
              setMessage(
                "Camera stopped. You can start again or search by name.",
              );
            }}
          >
            Stop camera
          </button>
        ) : (
          <button className="button" disabled={busy} onClick={start}>
            <Camera size={18} />
            {busy ? "Please wait…" : "Start camera"}
          </button>
        )}
        <label className="scanner-upload">
          Choose code image
          <input
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(event) => {
              void readImage(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <details className="scanner-manual">
        <summary>Enter a code or Peptivelo product link</summary>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            lookup(code);
          }}
        >
          <label htmlFor="manual-product-code">Code or product link</label>
          <input
            id="manual-product-code"
            value={code}
            maxLength={2048}
            onChange={(event) => setCode(event.target.value)}
            required
          />
          <button className="button secondary" type="submit">
            Look up code
          </button>
        </form>
      </details>
      <p className="scanner-limit">
        Manufacturer barcode coverage is not available yet. Peptivelo product QR
        links are supported. Scanning does not verify authenticity or contents.
      </p>
      <p className="identify-footnote">
        Images are processed in your browser and are not uploaded. Camera stops
        when you close this window.
      </p>
      <button
        className="identify-text-button"
        onClick={() => {
          stop();
          onSearch();
        }}
      >
        Search by name instead
      </button>
    </dialog>
  );
}
