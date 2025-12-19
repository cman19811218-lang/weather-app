"use client";

import { useState, useMemo } from "react";
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { formatTime, formatDate } from "@/lib/utils";

import { HourlyForecast, DailyForecast } from "@/lib/types";

interface ForecastGraphProps {
    hourlyData: HourlyForecast;
    dailyData: DailyForecast;
}

export default function ForecastGraph({ hourlyData, dailyData }: ForecastGraphProps) {
    const [mode, setMode] = useState<"24h" | "weekly">("24h");

    // Recharts用にデータを加工
    const chartData = useMemo(() => {
        if (mode === "24h" && hourlyData) {
            // 現在時刻から24時間分に切り出す
            const now = new Date();
            // APIのデータは0時から始まると仮定、あるいは現在時刻に合わせてスライス
            // Open-Meteoは過去のデータも含むため、現在時刻以降を探す
            // 簡易的に先頭24個を表示するロジック（実際は日付マッチングが必要）

            const startIndex = hourlyData.time.findIndex((t: string) => new Date(t) >= now);
            const start = startIndex >= 0 ? startIndex : 0;
            const end = start + 24;

            return hourlyData.time.slice(start, end).map((t: string, i: number) => ({
                time: formatTime(t),
                temp: hourlyData.temperature_2m[start + i],
                feels_like: hourlyData.apparent_temperature[start + i],
                wind: hourlyData.wind_speed_10m[start + i],
            }));
        } else if (mode === "weekly" && dailyData) {
            return dailyData.time.map((t: string, i: number) => ({
                time: formatDate(t),
                temp_max: dailyData.temperature_2m_max[i],
                temp_min: dailyData.temperature_2m_min[i],
                feels_like_max: dailyData.apparent_temperature_max ? dailyData.apparent_temperature_max[i] : null,
                feels_like_min: dailyData.apparent_temperature_min ? dailyData.apparent_temperature_min[i] : null,
                wind: dailyData.wind_speed_10m_max ? dailyData.wind_speed_10m_max[i] : null,
                // 天気コードも含めたいがグラフでは難しいので気温中心
            }));
        }
        return [];
    }, [mode, hourlyData, dailyData]);

    if (!chartData || chartData.length === 0) return null;

    return (
        <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-primary)" }}>予報グラフ</h3>

                <div style={{ display: "flex", background: "var(--bg-secondary)", borderRadius: "1rem", padding: "0.25rem", border: "1px solid var(--card-border)" }}>
                    <button
                        onClick={() => setMode("24h")}
                        style={{
                            padding: "0.4rem 1rem",
                            borderRadius: "0.8rem",
                            background: mode === "24h" ? "#ffffff" : "transparent",
                            color: mode === "24h" ? "var(--accent-color)" : "var(--text-secondary)",
                            fontWeight: 700,
                            boxShadow: mode === "24h" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                            transition: "all 0.2s"
                        }}
                    >
                        24時間
                    </button>
                    <button
                        onClick={() => setMode("weekly")}
                        style={{
                            padding: "0.4rem 1rem",
                            borderRadius: "0.8rem",
                            background: mode === "weekly" ? "#ffffff" : "transparent",
                            color: mode === "weekly" ? "var(--accent-color)" : "var(--text-secondary)",
                            fontWeight: 700,
                            boxShadow: mode === "weekly" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                            transition: "all 0.2s"
                        }}
                    >
                        週間
                    </button>
                </div>
            </div>

            <div style={{ height: "300px", width: "100%", marginLeft: "-10px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            unit="°"
                            width={30}
                            dx={-5}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                color: '#1e293b',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: '#334155' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />

                        {mode === "24h" ? (
                            <>
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp"
                                    name="気温"
                                    stroke="#f97316"
                                    fillOpacity={1}
                                    fill="url(#colorTemp)"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like"
                                    name="体感気温"
                                    stroke="#ec4899"
                                    fillOpacity={1}
                                    fill="url(#colorFeels)"
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                />
                            </>
                        ) : (
                            <>
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp_max"
                                    name="最高気温"
                                    stroke="#f97316"
                                    fill="url(#colorTemp)"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp_min"
                                    name="最低気温"
                                    stroke="#3b82f6"
                                    fill="transparent"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like_max"
                                    name="最高体感"
                                    stroke="#f97316"
                                    fill="transparent"
                                    strokeDasharray="4 4"
                                    strokeWidth={2}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like_min"
                                    name="最低体感"
                                    stroke="#3b82f6"
                                    fill="transparent"
                                    strokeDasharray="4 4"
                                    strokeWidth={2}
                                />
                            </>
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* 風速グラフは24時間・週間とも共通の構造で表示（データキーは'wind'で共通化済み） */}
            <div style={{ height: "160px", width: "100%", marginLeft: "-10px", marginTop: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "0.5rem", paddingLeft: "10px", fontWeight: 700 }}>
                    {mode === "24h" ? "風速" : "最大風速"}
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="var(--text-secondary)"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            unit="m/s"
                            width={30}
                            dx={-5}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '2px solid #e2e8f0',
                                borderRadius: '12px',
                                color: '#1e293b',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}
                            itemStyle={{ color: '#334155' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="wind"
                            name={mode === "24h" ? "風速" : "最大風速"}
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorWind)"
                            strokeWidth={3}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>);
}
