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
                // 日次データには風速の代表値がない場合があるが今回はAPI指定で取得していないため気温のみ表示
                // 天気コードも含めたいがグラフでは難しいので気温中心
            }));
        }
        return [];
    }, [mode, hourlyData, dailyData]);

    if (!chartData || chartData.length === 0) return null;

    return (
        <div className="glass-panel" style={{ padding: "2rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>予報グラフ</h3>

                <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", borderRadius: "0.5rem", padding: "0.25rem" }}>
                    <button
                        onClick={() => setMode("24h")}
                        style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.25rem",
                            background: mode === "24h" ? "var(--bg-secondary)" : "transparent",
                            color: mode === "24h" ? "var(--accent-color)" : "var(--text-secondary)",
                            fontWeight: 500,
                            transition: "all 0.2s"
                        }}
                    >
                        24時間
                    </button>
                    <button
                        onClick={() => setMode("weekly")}
                        style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "0.25rem",
                            background: mode === "weekly" ? "var(--bg-secondary)" : "transparent",
                            color: mode === "weekly" ? "var(--accent-color)" : "var(--text-secondary)",
                            fontWeight: 500,
                            transition: "all 0.2s"
                        }}
                    >
                        週間
                    </button>
                </div>
            </div>

            <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorFeels" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
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
                            dx={-10}
                        />
                        {mode === "24h" && (
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="var(--text-secondary)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                unit="m/s"
                                dx={10}
                            />
                        )}
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#f8fafc'
                            }}
                            itemStyle={{ color: '#f8fafc' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: "20px" }} />

                        {mode === "24h" ? (
                            <>
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp"
                                    name="気温"
                                    stroke="#38bdf8"
                                    fillOpacity={1}
                                    fill="url(#colorTemp)"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like"
                                    name="体感気温"
                                    stroke="#818cf8"
                                    fillOpacity={1}
                                    fill="url(#colorFeels)"
                                    strokeDasharray="5 5"
                                    strokeWidth={2}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="wind"
                                    name="風速"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </>
                        ) : (
                            <>
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp_max"
                                    name="最高気温"
                                    stroke="#f59e0b"
                                    fill="url(#colorTemp)"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="temp_min"
                                    name="最低気温"
                                    stroke="#38bdf8"
                                    fill="transparent"
                                    strokeWidth={3}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like_max"
                                    name="最高体感"
                                    stroke="#f59e0b"
                                    fill="transparent"
                                    strokeDasharray="4 4"
                                    strokeWidth={2}
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="feels_like_min"
                                    name="最低体感"
                                    stroke="#38bdf8"
                                    fill="transparent"
                                    strokeDasharray="4 4"
                                    strokeWidth={2}
                                />
                            </>
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
