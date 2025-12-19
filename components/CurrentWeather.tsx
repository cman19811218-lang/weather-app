"use client";

import { Wind, Droplets, Thermometer } from "lucide-react";

import { WeatherResponse } from "@/lib/types";
import { getWeatherInfo } from "@/lib/weatherCodes";

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

    // 天気情報を取得
    const weatherInfo = getWeatherInfo(weather_code);

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
            <div style={{ fontSize: "1.5rem", color: "var(--text-secondary)", margin: "1rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <weatherInfo.icon size={32} color={weatherInfo.color} />
                <span>{weatherInfo.label}</span>
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
