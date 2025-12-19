import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun } from "lucide-react";
import React from "react";

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
export function getWeatherInfo(code: number) {
    if (code === 0) {
        return { label: "快晴", icon: Sun, color: "#f59e0b" };
    }
    if (code >= 1 && code <= 3) {
        return { label: "晴れ/曇り", icon: Cloud, color: "#94a3b8" };
    }
    if (code >= 45 && code <= 48) {
        return { label: "霧", icon: CloudFog, color: "#64748b" };
    }
    if (code >= 51 && code <= 57) {
        return { label: "霧雨", icon: CloudDrizzle, color: "#38bdf8" };
    }
    if (code >= 61 && code <= 67) {
        return { label: "雨", icon: CloudRain, color: "#3b82f6" };
    }
    if (code >= 71 && code <= 77) {
        return { label: "雪", icon: CloudSnow, color: "#e2e8f0" };
    }
    if (code >= 80 && code <= 82) {
        return { label: "にわか雨", icon: CloudRain, color: "#60a5fa" };
    }
    if (code >= 85 && code <= 86) {
        return { label: "雪", icon: CloudSnow, color: "#cbd5e1" };
    }
    if (code >= 95) {
        return { label: "雷雨", icon: CloudLightning, color: "#f43f5e" };
    }
    return { label: "不明", icon: Cloud, color: "#94a3b8" };
}
