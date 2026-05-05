"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clsx } from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm" />
      <div
        className={clsx(
          "relative w-full bg-surface rounded-3xl shadow-[0_24px_60px_rgb(0_0_0_/_0.18)] border border-line",
          "animate-in fade-in zoom-in-95 duration-150",
          sizes[size]
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-7 py-5 border-b border-line">
            <h2 className="text-[17px] font-semibold text-ink tracking-tight">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full text-ink-mute transition-colors hover:bg-surface-2 hover:text-ink"
              aria-label="Close"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}
