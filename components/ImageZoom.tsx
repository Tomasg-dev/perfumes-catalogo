"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const CLICK_ZOOM_SCALE = 2.5;
const TAP_MOVE_THRESHOLD = 10;

interface Point {
  x: number;
  y: number;
}

export default function ImageZoom({
  src,
  alt,
  children,
  className,
}: {
  src: string;
  alt: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`cursor-zoom-in ${className ?? ""}`}
        role="button"
        aria-label={`Ver imagen de ${alt} en grande`}
      >
        {children}
      </div>
      {open && <Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const pointers = useRef<Map<number, Point>>(new Map());
  const dragStart = useRef<Point | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const tapStart = useRef<Point | null>(null);
  const tapOnImage = useRef(false);
  const wasMultiTouch = useRef(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  function clampScale(s: number) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));
  }

  function toggleZoomAt(point: Point) {
    if (scale > 1) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
      return;
    }
    setScale(CLICK_ZOOM_SCALE);
    const rect = imgRef.current?.getBoundingClientRect();
    if (rect) {
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setOffset({
        x: (cx - point.x) * (CLICK_ZOOM_SCALE - 1),
        y: (cy - point.y) * (CLICK_ZOOM_SCALE - 1),
      });
    }
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setScale((s) => {
      const next = clampScale(s - e.deltaY * 0.01);
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }

  function handlePointerDown(e: React.PointerEvent) {
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch {
      // Ignora: puede fallar si el navegador no asocia el pointerId a una
      // sesión activa (no afecta el resto de la interacción).
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1) {
      dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
      tapStart.current = { x: e.clientX, y: e.clientY };
      tapOnImage.current = e.target === imgRef.current;
      wasMultiTouch.current = false;
    } else if (pointers.current.size === 2) {
      wasMultiTouch.current = true;
      dragStart.current = null;
      tapStart.current = null;
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStart.current = { dist, scale };
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const pts = Array.from(pointers.current.values());
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const next = clampScale(pinchStart.current.scale * (dist / pinchStart.current.dist));
      setScale(next);
    } else if (pointers.current.size === 1 && dragStart.current && scale > 1) {
      setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    const wasSinglePointer = pointers.current.size === 1;
    const start = tapStart.current;
    const onImage = tapOnImage.current;

    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) dragStart.current = null;

    if (!wasSinglePointer || wasMultiTouch.current || !start) return;

    const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
    if (moved >= TAP_MOVE_THRESHOLD) return; // fue un arrastre/pan, no un tap

    if (onImage) {
      toggleZoomAt({ x: e.clientX, y: e.clientY });
    } else {
      onClose();
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex touch-none items-center justify-center overflow-hidden bg-black/90 backdrop-blur-sm"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={false}
        className={`max-h-[92vh] max-w-[92vw] touch-none select-none object-contain ${
          scale > 1 ? "cursor-grab" : "cursor-zoom-in"
        }`}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transition: pointers.current.size > 0 ? "none" : "transform 150ms ease-out",
        }}
      />

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-white/60">
        Clic o pellizca sobre la imagen para acercar · clic afuera para cerrar
      </p>
    </div>,
    document.body
  );
}
