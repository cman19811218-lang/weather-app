import { SearchResult } from "./types";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function searchLocation(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
        const url = `${GEOCODING_API}?name=${encodeURIComponent(
            query
        )}&count=5&language=ja&format=json`;
        const res = await fetch(url);
        const data = await res.json();
        return data.results || [];
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}

export async function getWeather(lat: number, lon: number) {
    try {
        const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day&hourly=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto`;
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error("Weather fetch error:", error);
        throw error;
    }
}
