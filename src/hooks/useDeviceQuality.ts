import { useEffect, useState } from "react"

export type DeviceQuality = "low" | "medium" | "high"

export function useDeviceQuality(): DeviceQuality {
    const [quality, setQuality] = useState<DeviceQuality>(() => {
        if (typeof window === "undefined") return "high"
        const w = window.innerWidth
        if (w < 640) return "low"
        if (w < 1280) return "medium"
        return "high"
    })

    useEffect(() => {
        function onResize() {
            const w = window.innerWidth
            if (w < 640) setQuality("low")
            else if (w < 1280) setQuality("medium")
            else setQuality("high")
        }

        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    return quality
}
