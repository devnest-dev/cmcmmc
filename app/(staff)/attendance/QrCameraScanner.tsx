"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

type PermissionState = "pending" | "granted" | "denied";

export default function QrCameraScanner({ onDecode }: { onDecode: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onDecodeRef = useRef(onDecode);
  const [permission, setPermission] = useState<PermissionState>("pending");

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const scanner = new QrScanner(
      video,
      (result) => onDecodeRef.current(result.data),
      { highlightScanRegion: true, highlightCodeOutline: true },
    );
    scannerRef.current = scanner;

    scanner
      .start()
      .then(() => setPermission("granted"))
      .catch(() => setPermission("denied"));

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, []);

  function handleRetry() {
    setPermission("pending");
    scannerRef.current
      ?.start()
      .then(() => setPermission("granted"))
      .catch(() => setPermission("denied"));
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black">
        <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
      </div>
      {permission === "denied" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Camera access needed</p>
          <p className="mt-1">Allow camera access in your browser to scan registrant QR codes.</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
