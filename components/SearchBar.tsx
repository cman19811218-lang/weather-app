"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { searchLocation } from "@/lib/api";
import { SearchResult } from "@/lib/types";

interface SearchBarProps {
    onLocationSelect: (location: SearchResult) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            const data = await searchLocation(query);
            setResults(data);
            setIsLoading(false);
            setIsOpen(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (location: SearchResult) => {
        onLocationSelect(location);
        setQuery("");
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <div
                className="glass-panel"
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.75rem 1rem",
                    borderRadius: "999px",
                }}
            >
                <Search size={20} style={{ color: "var(--text-secondary)", marginRight: "0.5rem" }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="地域を検索 (例: 東京, Osaka)"
                    style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                        outline: "none",
                    }}
                />
                {isLoading && (
                    <div
                        style={{
                            width: "16px",
                            height: "16px",
                            border: "2px solid var(--text-secondary)",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                        }}
                    />
                )}
            </div>

            {isOpen && results.length > 0 && (
                <div
                    className="glass-panel"
                    style={{
                        position: "absolute",
                        top: "120%",
                        left: 0,
                        right: 0,
                        zIndex: 50,
                        padding: "0.5rem",
                        borderRadius: "1rem",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {results.map((result) => (
                        <button
                            type="button"
                            key={result.id}
                            onClick={(e) => {
                                e.preventDefault();
                                console.log("Selected:", result);
                                handleSelect(result);
                            }}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                display: "flex",
                                alignItems: "center",
                                textAlign: "left",
                                borderRadius: "0.5rem",
                                color: "var(--text-primary)",
                                transition: "background 0.2s",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--bg-secondary)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                        >
                            <MapPin size={16} style={{ marginRight: "0.75rem", color: "var(--accent-color)" }} />
                            <div>
                                <div style={{ fontWeight: 500 }}>{result.name}</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                                    {result.admin1 ? `${result.admin1}, ` : ""}
                                    {result.country}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
