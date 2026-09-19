import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Strix | Product Engineering Studio",
        short_name: "Strix",
        description: "Product engineering studio for software products, backend systems, mobile experiences, and AI-enabled workflows.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#0b0d10",
        theme_color: "#0b0d10",
        icons: [
            {
                src: "/icon",
                sizes: "512x512",
                type: "image/png",
                purpose: "any",
            },
            {
                src: "/icon",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    }
}