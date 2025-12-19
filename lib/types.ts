export interface WeatherData {
    temperature: number;
    apparentTemperature: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    isDay: boolean;
    time: string;
}

export interface HourlyForecast {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    wind_speed_10m: number[];
}

export interface DailyForecast {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    wind_speed_10m_max: number[];
    weather_code: number[];
}

export interface SearchResult {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
}

export interface WeatherResponse {
    current: {
        time: string;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        weather_code: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
        is_day: number;
    };
    hourly: HourlyForecast;
    daily: DailyForecast;
    hourly_units: Record<string, string>;
    daily_units: Record<string, string>;
}
