"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function FooterWordmark() {
  const containerRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  const springY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
  });

  const outlineX = useTransform(springX, [-500, 500], [-8, 8]);
  const outlineY = useTransform(springY, [-500, 500], [-5, 5]);

  const glowX = useTransform(springX, [-500, 500], ["40%", "60%"]);
  const glowY = useTransform(springY, [-500, 500], ["40%", "60%"]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();

      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);

      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    const element = containerRef.current;

    element?.addEventListener("mousemove", handleMouseMove);
    element?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element?.removeEventListener("mousemove", handleMouseMove);
      element?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="
        group
        relative
        w-full
        overflow-hidden
        border-t
        border-black/[0.08]
        bg-background
        text-foreground
        dark:border-white/[0.08]
      "
    >
      {/* ------------------------------------------------------------ */}
      {/* Background grid                                               */}
      {/* ------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          dark:opacity-[0.045]
        "
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              currentColor 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              currentColor 1px,
              transparent 1px
            )
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ------------------------------------------------------------ */}
      {/* Cursor spotlight                                               */}
      {/* ------------------------------------------------------------ */}

      <motion.div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          z-0
          h-[420px]
          w-[420px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#e33d23]/[0.035]
          blur-[110px]
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
          dark:bg-[#e33d23]/[0.055]
        "
        style={{
          left: glowX,
          top: glowY,
        }}
      />

      {/* ------------------------------------------------------------ */}
      {/* Center construction lines                                     */}
      {/* ------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-0
          top-1/2
          h-px
          w-full
          bg-black/[0.045]
          dark:bg-white/[0.06]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-full
          w-px
          bg-black/[0.035]
          dark:bg-white/[0.045]
        "
      />

      {/* ------------------------------------------------------------ */}
      {/* Main canvas                                                    */}
      {/* ------------------------------------------------------------ */}

      <div
        className="
          relative
          mx-auto
          flex
          min-h-[360px]
          max-w-[1800px]
          items-center
          px-6
          py-24
          sm:min-h-[440px]
          sm:px-10
          sm:py-28
          lg:min-h-[520px]
          lg:px-12
          lg:py-32
        "
      >
        {/* ---------------------------------------------------------- */}
        {/* Corner marks                                                 */}
        {/* ---------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className="
            absolute
            left-6
            top-6
            h-4
            w-4
            border-l
            border-t
            border-[#e33d23]/70
            sm:left-10
            sm:top-10
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            right-6
            top-6
            h-4
            w-4
            border-r
            border-t
            border-[#e33d23]/70
            sm:right-10
            sm:top-10
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            bottom-6
            left-6
            h-4
            w-4
            border-b
            border-l
            border-black/20
            dark:border-white/20
            sm:bottom-10
            sm:left-10
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            bottom-6
            right-6
            h-4
            w-4
            border-b
            border-r
            border-black/20
            dark:border-white/20
            sm:bottom-10
            sm:right-10
          "
        />

        {/* ---------------------------------------------------------- */}
        {/* Wordmark container                                           */}
        {/* ---------------------------------------------------------- */}

        <div className="relative z-10 w-full">
          {/* Small top label */}
          <div className="mb-8 flex items-center justify-between">
            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-foreground/30
                sm:text-[9px]
              "
            >
              Engineering Studio
            </span>

            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-foreground/30
                sm:text-[9px]
              "
            >
              01 / 01
            </span>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Wordmark                                                   */}
          {/* -------------------------------------------------------- */}

          <div className="relative overflow-visible">
            {/* Outline layer */}
            <motion.div
              aria-hidden="true"
              style={{
                x: outlineX,
                y: outlineY,
              }}
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                flex
                items-start
                justify-start
              "
            >
              <div
                className="
                  max-w-full
                  text-left
                  font-serif
                  text-[20vw]
                  font-normal
                  
                  leading-[0.82]
                  tracking-[-0.065em]
                  text-transparent
                  [-webkit-text-stroke:1px_rgba(128,128,128,0.25)]
                  sm:text-[13vw]
                  lg:text-[10vw]
                "
              >
                <span className="block">Strix</span>
                <span className="block">Engineering</span>
                <span className="block">Studio</span>
              </div>
            </motion.div>

            {/* Main wordmark */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                relative
                z-10
                max-w-full
                text-left
                font-serif
                text-[17vw]
                font-normal
                
                leading-[0.82]
                tracking-[-0.065em]
                text-foreground
                sm:text-[13vw]
                lg:text-[10vw]
              "
            >
              <span className="block">Strix</span>

              <span className="block">Engineering</span>

              <span className="block">Studio</span>
            </motion.div>

            {/* Orange cursor-reactive line */}
            <motion.div
              aria-hidden="true"
              style={{
                x: useTransform(springX, [-500, 500], [-30, 30]),
              }}
              className="
                pointer-events-none
                absolute
                bottom-[-18px]
                left-0
                h-[2px]
                w-[80px]
                bg-[#e33d23]
                transition-all
                duration-500
                group-hover:w-[160px]
                sm:bottom-[-24px]
              "
            />
          </div>

          {/* -------------------------------------------------------- */}
          {/* Bottom information                                        */}
          {/* -------------------------------------------------------- */}

          <div
            className="
              mt-14
              flex
              flex-col
              gap-4
              border-t
              border-black/[0.08]
              pt-5
              dark:border-white/[0.08]
              sm:mt-16
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-foreground/35
                sm:text-[9px]
              "
            >
              System Before Software
            </span>

            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.3em]
                text-foreground/35
                sm:text-[9px]
              "
            >
              India · 2026
            </span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Bottom signal                                                  */}
      {/* ------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="
          relative
          h-px
          w-full
          bg-black/[0.08]
          dark:bg-white/[0.08]
        "
      >
        <motion.div
          initial={{
            width: "0%",
          }}
          whileInView={{
            width: "35%",
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-px bg-[#e33d23]"
        />
      </div>
    </section>
  );
}
