"use client";

import { useEffect, useRef, useState } from "react";

const RESET_MS = 2000;

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [status, setStatus] = useState(label);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Could not copy");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(label), RESET_MS);
  };

  return (
    <button type="button" onClick={copy} aria-live="polite" className="button button-ghost cursor-pointer">
      {status}
    </button>
  );
}
