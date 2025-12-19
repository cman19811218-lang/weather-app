"use client";

import { Wind, Droplets, Thermometer } from "lucide-react";

import { WeatherResponse } from "@/lib/types";

interface CurrentWeatherProps {
    data: WeatherResponse;
    locationName: string;
}

export default function CurrentWeather({ data, locationName }: CurrentWeatherProps) {
    if (!data || !data.current) return null;

    const {
        temperature_2m,
        apparent_temperature,
        relative_humidity_2m,
        wind_speed_10m,
        weather_code,
    } = data.current;

    // 天気コードに基づく表示（簡易版）
    // 実際には詳細なマッピングが必要
    const getWeatherLabel = (code: number) => {
        if (code === 0) return "快晴";
        if (code >= 1 && code <= 3) return "晴れ/曇り";
        if (code >= 45 && code <= 48) return "霧";
        if (code >= 51 && code <= 67) return "雨";
        if (code >= 71 && code <= 77) return "雪";
        if (code >= 80 && code <= 82) return "にわか雨";
        if (code >= 95) return "雷雨";
        return "不明";
    };

    return (
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 300, marginBottom: "0.5rem" }}>
                {locationName}
            </h2>
            <div
                className="text-gradient"
                style={{ fontSize: "5rem", fontWeight: 700, lineHeight: 1 }}
            >
                {Math.round(temperature_2m)}°
            </div>
            <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)", margin: "1rem 0" }}>
                {getWeatherLabel(weather_code)}
            </div>

            <div
                className="glass-panel"
                style={{
                    display: "inline-flex",
                    gap: "2rem",
                    padding: "1.5rem 3rem",
                    marginTop: "1rem",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <Thermometer size={24} color="var(--accent-color)" />
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>体感</span>
                    <span style={{ fontWeight: 600 }}>{Math.round(apparent_temperature)}°</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <Droplets size={24} color="var(--accent-color)" />
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>湿度</span>
                    <span style={{ fontWeight: 600 }}>{relative_humidity_2m}%</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <Wind size={24} color="var(--accent-color)" />
                    <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>風速</span>
                    <span style={{ fontWeight: 600 }}>{wind_speed_10m} m/s</span>
                </div>
            </div>
        </div>
    );
}
