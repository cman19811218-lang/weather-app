"use client";

import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import CurrentWeather from "./CurrentWeather";
import ForecastGraph from "./ForecastGraph";
import WeeklyForecast from "./WeeklyForecast";
import { getWeather } from "@/lib/api";
import { WeatherResponse, SearchResult } from "@/lib/types";

export default function WeatherDashboard() {
    const [data, setData] = useState<WeatherResponse | null>(null);
    const [locationName, setLocationName] = useState("Tokyo, Japan");
    const [loading, setLoading] = useState(true);

    const fetchWeather = async (lat: number, lon: number, name: string) => {
        setLoading(true);
        try {
            const weatherData = await getWeather(lat, lon);
            setData(weatherData);
            setLocationName(name);
        } catch (error) {
            console.error("Failed to fetch weather:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 初期ロード: 東京
        fetchWeather(35.6895, 139.6917, "Tokyo, Japan");
    }, []);

    const handleLocationSelect = (location: SearchResult) => {
        const name = location.admin1
            ? `${location.name}, ${location.admin1}, ${location.country}`
            : `${location.name}, ${location.country}`;
        console.log("Fetching weather for:", name, location.latitude, location.longitude);
        fetchWeather(location.latitude, location.longitude, name);
    };

    return (
        <main className="container">
            <div style={{ marginBottom: "2rem" }}>
                <SearchBar onLocationSelect={handleLocationSelect} />
            </div>

            {loading ? (
                <div style={{ textAlign: "center", marginTop: "4rem", color: "var(--text-secondary)" }}>
                    データを読み込み中...
                </div>
            ) : data ? (
                <div style={{ animation: "fadeIn 0.5s ease-out" }}>
                    <CurrentWeather data={data} locationName={locationName} />
                    <ForecastGraph hourlyData={data.hourly} dailyData={data.daily} />
                    <WeeklyForecast data={data.daily} />
                </div>
            ) : (
                <div style={{ textAlign: "center", marginTop: "4rem" }}>
                    データを取得できませんでした。
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </main>
    );
}
