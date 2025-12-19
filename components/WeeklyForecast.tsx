"use client";

import { Droplets, Wind } from "lucide-react";
import { DailyForecast } from "@/lib/types";
import { getWeatherInfo } from "@/lib/weatherCodes";
import { formatDate } from "@/lib/utils";

interface WeeklyForecastProps {
    data: DailyForecast;
}

export default function WeeklyForecast({ data }: WeeklyForecastProps) {
    if (!data) return null;

    return (
        <div className="glass-panel" style={{ padding: "1.5rem", marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
                週間予報
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {data.time.map((time, index) => {
                    const weatherCode = data.weather_code[index];
                    const info = getWeatherInfo(weatherCode);
                    const Icon = info.icon;

                    // 日付の表示用（今日、明日などの判定も入れたいが、まずは日付のみ）
                    const dateLabel = formatDate(time);

                    return (
                        <div
                            key={time}
                            className="glass-panel weekly-forecast-item"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "70px 90px 1fr 1fr 80px",
                                alignItems: "center",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "1rem",
                                background: "#ffffff",
                                border: "2px solid #e0f2fe",
                                boxShadow: "0 2px 0 #e0f2fe",
                                gap: "0.25rem",
                                marginBottom: "0.2rem"
                            }}
                        >
                            {/* スマホレイアウト用ラッパー: Row 1 (日付・天気) */}
                            <div className="weekly-forecast-row" style={{ display: "contents" }}>
                                {/* 日付 */}
                                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.8rem" }}>
                                    {dateLabel}
                                </div>

                                {/* 天気アイコンとラベル */}
                                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                    <Icon size={20} color={info.color} />
                                    <span className="hide-on-mobile" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{info.label}</span>
                                </div>
                            </div>

                            {/* スマホレイアウト用ラッパー: Row 2 (詳細データ) */}
                            <div className="weekly-forecast-row" style={{ display: "contents" }}>
                                {/* 気温 (最高 / 最低) */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                    <span className="hide-on-mobile" style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "0" }}>気温</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        <span style={{ color: "#f97316", fontWeight: 700 }}>
                                            {Math.round(data.temperature_2m_max[index])}°
                                        </span>
                                        <span style={{ color: "#3b82f6", fontWeight: 700 }}>
                                            {Math.round(data.temperature_2m_min[index])}°
                                        </span>
                                    </div>
                                </div>

                                {/* 体感気温 */}
                                {(data.apparent_temperature_max && data.apparent_temperature_min) && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                        <span className="hide-on-mobile" style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "0" }}>体感</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                            <span style={{ color: "#f97316", fontWeight: 600, opacity: 0.8 }}>
                                                {Math.round(data.apparent_temperature_max[index])}°
                                            </span>
                                            <span style={{ color: "#3b82f6", fontWeight: 600, opacity: 0.8 }}>
                                                {Math.round(data.apparent_temperature_min[index])}°
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* 風速（最大） */}
                                {data.wind_speed_10m_max && (
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", color: "var(--text-secondary)" }}>
                                        <span className="hide-on-mobile" style={{ fontSize: "0.65rem", marginBottom: "0" }}>風速</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                            <Wind size={14} />
                                            <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                                                {Math.round(data.wind_speed_10m_max[index])}m
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
