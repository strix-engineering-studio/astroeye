"use client";

type LinkedInPostProps = {
  embedUrl: string;
  signal?: string;
  date?: string;
  className?: string;
};

export function LinkedInPost({
  embedUrl,
  signal = "SIGNAL / 001",
  date,
  className = "",
}: LinkedInPostProps) {
  return (
    <article
      className={`
        group relative overflow-hidden
        border border-black/10
        bg-background
        text-foreground
        dark:border-white/10
        ${className}
      `}
    >
      {/* Technical grid */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          opacity-[0.025]
          dark:opacity-[0.04]
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
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#e8541c]
              "
            />

            <span
              className="
                font-mono
                text-[9px]
                uppercase
                tracking-[0.25em]
                text-foreground/50
              "
            >
              FROM THE STUDIO
            </span>
          </div>

          <span
            className="
              font-mono
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-foreground/30
            "
          >
            {signal}
          </span>
        </header>

        {/* LinkedIn */}
        <div className="relative bg-background">
          <iframe
            src={embedUrl}
            title="Strix Engineering Studio LinkedIn post"
            className="
              block
              w-full
              border-0
            "
            height="700"
            frameBorder="0"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-5 py-4 dark:border-white/10 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="
                font-mono
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-foreground/35
              "
            >
              LINKEDIN
            </span>

            {date && (
              <>
                <span className="text-foreground/20">/</span>

                <span
                  className="
                    font-mono
                    text-[8px]
                    uppercase
                    tracking-[0.2em]
                    text-foreground/35
                  "
                >
                  {date}
                </span>
              </>
            )}
          </div>

          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              font-mono
              text-[8px]
              uppercase
              tracking-[0.2em]
              text-foreground/45
              transition-colors
              hover:text-[#e8541c]
            "
          >
            View on LinkedIn →
          </a>
        </footer>
      </div>
    </article>
  );
}

// "use client";

// import { useEffect, useRef } from "react";

// type LinkedInPostProps = {
//   postUrl: string;
//   label?: string;
//   signal?: string;
//   date?: string;
//   className?: string;
// };

// export function LinkedInPost({
//   postUrl,
//   label = "FROM THE STUDIO",
//   signal = "SIGNAL / 001",
//   date,
//   className = "",
// }: LinkedInPostProps) {
//   const embedRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!embedRef.current) {
//       return;
//     }

//     const container = embedRef.current;

//     container.innerHTML = "";

//     const blockquote = document.createElement("blockquote");

//     blockquote.className = "linkedin-embed";
//     blockquote.setAttribute("data-url", postUrl);

//     const link = document.createElement("a");
//     link.href = postUrl;
//     link.target = "_blank";
//     link.rel = "noopener noreferrer";

//     link.textContent = "View this post on LinkedIn";

//     blockquote.appendChild(link);
//     container.appendChild(blockquote);

//     const existingScript = document.querySelector(
//       'script[src="https://www.linkedin.com/embed/feed/update.js"]',
//     );

//     if (existingScript) {
//       window.IN?.parse?.();
//       return;
//     }

//     const script = document.createElement("script");

//     script.src = "https://www.linkedin.com/embed/feed/update.js";

//     script.async = true;
//     script.defer = true;

//     document.body.appendChild(script);
//   }, [postUrl]);

//   return (
//     <article
//       className={`
//         group relative overflow-hidden
//         border border-black/10
//         bg-background
//         text-foreground
//         dark:border-white/10
//         ${className}
//       `}
//     >
//       {/* Technical grid */}
//       <div
//         aria-hidden="true"
//         className="
//           pointer-events-none
//           absolute inset-0
//           opacity-[0.025]
//           dark:opacity-[0.04]
//         "
//         style={{
//           backgroundImage: `
//             linear-gradient(
//               to right,
//               currentColor 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               to bottom,
//               currentColor 1px,
//               transparent 1px
//             )
//           `,
//           backgroundSize: "48px 48px",
//         }}
//       />

//       <div className="relative">
//         {/* Header */}
//         <header className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10 sm:px-6">
//           <div className="flex items-center gap-3">
//             <span
//               aria-hidden="true"
//               className="
//                 h-1.5
//                 w-1.5
//                 rounded-full
//                 bg-[#e8541c]
//                 shadow-[0_0_12px_rgba(232,84,28,0.45)]
//               "
//             />

//             <span
//               className="
//                 font-mono
//                 text-[9px]
//                 font-medium
//                 uppercase
//                 tracking-[0.25em]
//                 text-foreground/50
//               "
//             >
//               {label}
//             </span>
//           </div>

//           <span
//             className="
//               font-mono
//               text-[8px]
//               uppercase
//               tracking-[0.2em]
//               text-foreground/30
//             "
//           >
//             {signal}
//           </span>
//         </header>

//         {/* LinkedIn embed */}
//         <div className="relative px-4 py-5 sm:px-6 sm:py-6">
//           <div
//             ref={embedRef}
//             className="
//               linkedin-post-container
//               mx-auto
//               w-full
//               max-w-[680px]
//             "
//           />
//         </div>

//         {/* Footer metadata */}
//         <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-5 py-4 dark:border-white/10 sm:px-6">
//           <div className="flex items-center gap-3">
//             <span
//               className="
//                 font-mono
//                 text-[8px]
//                 uppercase
//                 tracking-[0.2em]
//                 text-foreground/35
//               "
//             >
//               LinkedIn
//             </span>

//             {date && (
//               <>
//                 <span className="text-foreground/20">/</span>

//                 <span
//                   className="
//                     font-mono
//                     text-[8px]
//                     uppercase
//                     tracking-[0.2em]
//                     text-foreground/35
//                   "
//                 >
//                   {date}
//                 </span>
//               </>
//             )}
//           </div>

//           <a
//             href={postUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="
//               group/link
//               flex
//               items-center
//               gap-2
//               font-mono
//               text-[8px]
//               font-medium
//               uppercase
//               tracking-[0.2em]
//               text-foreground/50
//               transition-colors
//               hover:text-[#e8541c]
//             "
//           >
//             View Original
//             <span
//               aria-hidden="true"
//               className="
//                 transition-transform
//                 duration-300
//                 group-hover/link:translate-x-1
//               "
//             >
//               →
//             </span>
//           </a>
//         </footer>
//       </div>
//     </article>
//   );
// }
