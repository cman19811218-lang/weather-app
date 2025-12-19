import { SearchResult } from "./types";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function searchLocation(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];

    try {
        // 日本語が含まれているかチェック
        const isJapanese = /[一-龠ぁ-ゔァ-ヴー]/.test(query);
        const queries = [query];

        if (isJapanese) {
            // 接尾辞がない場合、市や区を付与して検索候補に追加
            // すでに接尾辞がある場合は重複して検索しないようにチェックしても良いが、
            // API側で吸収されるので単純に並列リクエストを送る
            if (!query.endsWith("市") && !query.endsWith("区") && !query.endsWith("町") && !query.endsWith("村")) {
                queries.push(query + "市");
                queries.push(query + "区");
            }
        }

        // 並列で検索実行
        const requests = queries.map(q =>
            fetch(`${GEOCODING_API}?name=${encodeURIComponent(q)}&count=5&language=ja&format=json`)
                .then(res => res.json())
                .catch(() => ({ results: [] }))
        );

        const responses = await Promise.all(requests);

        // 結果を結合して重複除去 (IDを使用)
        const allResults: SearchResult[] = [];
        const seenIds = new Set<number>();

        for (const data of responses) {
            if (data.results) {
                for (const result of data.results) {
                    if (!seenIds.has(result.id)) {
                        seenIds.add(result.id);
                        allResults.push(result);
                    }
                }
            }
        }

        return allResults;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}

export async function getWeather(lat: number, lon: number) {
    try {
        const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,is_day&hourly=temperature_2m,apparent_temperature,precipitation_probability,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max&timezone=auto`;
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error("Weather fetch error:", error);
        throw error;
    }
}
