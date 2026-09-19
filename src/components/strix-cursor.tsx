"use client";

import { useEffect, useRef } from "react";

export function StrixCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const position = useRef({
    x: -100,
    y: -100,
  });

  const target = useRef({
    x: -100,
    y: -100,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (!mediaQuery.matches) {
      return;
    }

    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = event.target;

      if (!(element instanceof Element)) {
        return;
      }

      const interactive = element.closest(
        "a, button, input, textarea, select, [role='button'], [data-cursor='interactive']",
      );

      cursor.dataset.interactive = interactive ? "true" : "false";
    };

    const handlePointerLeave = () => {
      cursor.dataset.visible = "false";
    };

    const handlePointerEnter = () => {
      cursor.dataset.visible = "true";
    };

    const handlePointerDown = () => {
      cursor.dataset.clicked = "true";

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = setTimeout(() => {
        cursor.dataset.clicked = "false";
      }, 450);
    };

    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * 0.22;

      position.current.y += (target.current.y - position.current.y) * 0.22;

      cursor.style.transform = `translate3d(
        ${position.current.x}px,
        ${position.current.y}px,
        0
      )`;

      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerOver);
    window.addEventListener("pointerenter", handlePointerEnter);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown);

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-visible="true"
      data-interactive="false"
      data-clicked="false"
      className="strix-cursor"
    >
      {/* ---------------------------------------------------------- */}
      {/* Normal vector cursor                                        */}
      {/* ---------------------------------------------------------- */}

      <svg
        viewBox="0 0 32 40"
        className="strix-cursor__svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main pointer */}
        <path
          d="
            M3 2
            L28 20
            L17 22
            L24 35
            L19 38
            L12 25
            L5 32
            Z
          "
          className="strix-cursor__pointer"
        />

        {/* Inner construction line */}
        <path
          d="
            M7 8
            L21 19
            L15 20
            L20 30
          "
          className="strix-cursor__construction"
        />

        {/* Orange accent */}
        <path d="M3 2L12 25" className="strix-cursor__accent" />
      </svg>

      {/* ---------------------------------------------------------- */}
      {/* Click spark                                                 */}
      {/* ---------------------------------------------------------- */}

      <span className="strix-cursor__spark">
        <span className="strix-cursor__spark-line strix-cursor__spark-line--1" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--2" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--3" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--4" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--5" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--6" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--7" />
        <span className="strix-cursor__spark-line strix-cursor__spark-line--8" />
      </span>

      {/* Click center */}
      <span className="strix-cursor__click-dot" />
    </div>
  );
}
