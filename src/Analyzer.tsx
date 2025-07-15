import React, { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Article {
    title: string;
    url: string;
    sentiment: string;
    score:string;
}

const spinnerStyle: React.CSSProperties = {
    margin: "20px auto",
    border: "6px solid #e0f2f1",
    borderTop: "6px solid #00796b",
    borderRadius: "50%",
    width: 40,
    height: 40,
    animation: "spin 1s linear infinite",
};

const Analyzer: React.FC = () => {
    const [bankName, setBankName] = useState("");
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [language, setLanguage] = useState("en");
    const [apiVersion, setApiVersion] = useState("analyze/");
    const [articleCount, setArticleCount] = useState(10);
    const navigate = useNavigate();


    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!bankName.trim()) {
            setError("Please enter the name of a bank.");
            return;
        }

        setLoading(true);
        setError(null);
        setArticles([]);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);
            const response = await fetch("https://sentiment-analysys-backend.onrender.com/"+apiVersion, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bank_name: bankName.trim() ,
                    language: language,limit:articleCount}),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Network response was not ok");
            type ApiResponse = Article[] | { error: string };
            const data: ApiResponse = await response.json();
            if ("error" in data) {
                setError(data.error);
            } else {
                setArticles(data);
            }
        } catch (error: any) {
            if (error.name === "AbortError") {
                setError("Request timed out after 10 seconds.");
            } else {
                setError("Failed to fetch sentiment analysis.");
            }
        } finally {
            setLoading(false);
        }

    };

    const [sortBy, setSortBy] = useState<keyof Article | "score" | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const handleSort = (column: keyof Article | "score") => {
        if (sortBy === column) {
            setSortAsc(!sortAsc); // Toggle direction
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    const sortedArticles = [...articles].sort((a, b) => {
        if (!sortBy) return 0;
        const valA = sortBy === "score" ? (a as any)[sortBy] : a[sortBy];
        const valB = sortBy === "score" ? (b as any)[sortBy] : b[sortBy];
        if (valA == null) return 1;
        if (valB == null) return -1;
        if (typeof valA === "number") {
            return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });


    return (
        <div
            style={{
                position: "relative", // Add this line
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
                background: "linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)",
                color: "#e0f7fa",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                textAlign: "center",
            }}
        >

            <button
                onClick={() => navigate(-1)}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: "10px 20px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    borderRadius: 8,
                    border: "none",
                    backgroundColor: "#004d40",
                    color: "#e0f2f1",
                    cursor: "pointer",
                    boxShadow: "0 3px 8px rgba(0, 77, 64, 0.3)",
                    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#002921";
                    e.currentTarget.style.boxShadow = "0 5px 12px rgba(0, 41, 33, 0.5)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#004d40";
                    e.currentTarget.style.boxShadow = "0 3px 8px rgba(0, 77, 64, 0.3)";
                }}
            >
                Go Back
            </button>

            <h1 style={{textAlign: "center", marginBottom: 30, fontSize: "2.5rem"}}>
                Bank Sentiment Analyzer
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 30,
                }}
            >
                <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                    <label htmlFor="languages" style={{fontWeight: "bold"}}>
                        Which language to search for in articles:
                    </label>
                    <select
                        id="languages"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{
                            padding: 12,
                            fontSize: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid #004d40",
                            outline: "none",
                            color: "#004d40",
                            backgroundColor: "#e0f2f1",
                        }}
                    >
                        <option value="all">All Languages</option>
                        <option value="en">English</option>
                        <option value="pt">Portuguese</option>
                    </select>
                </div>


                <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                    <label htmlFor="api-version" style={{fontWeight: "bold"}}>
                        API Version:
                    </label>
                    <select
                        id="api-version"
                        value={apiVersion}
                        onChange={(e) => setApiVersion(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            fontSize: "1rem",
                            border: "1px solid #004d40",
                            backgroundColor: "#e0f2f1",
                            color: "#004d40"
                        }}
                    >
                        <option value="analyze/">First Iteration</option>
                        <option value="analyze_v2/">With Google News RSS (Slower)</option>
                        <option value="analyze_llm/">With Langchain</option>
                        <option value="analyze_llm_serper/">With Langchain and SERPER_API</option>
                    </select>
                </div>

                <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                    <label htmlFor="article-count" style={{fontWeight: "bold"}}>
                        Number of articles to fetch:
                    </label>
                    <input
                        id="article-count"
                        type="number"
                        min={1}
                        max={100}
                        value={articleCount}
                        onChange={(e) => setArticleCount(Number(e.target.value))}
                        style={{
                            padding: 12,
                            fontSize: "1.1rem",
                            borderRadius: 8,
                            border: "1px solid #004d40",
                            outline: "none",
                            color: "#004d40",
                            backgroundColor: "#e0f2f1",
                            width: 100,
                        }}
                    />
                </div>

                <div style={{display: "flex", gap: 12, width: "100%", maxWidth: 600}}>
                    <input
                        id="bank-name"
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Enter bank name, e.g. JPMorgan"
                        style={{
                            padding: 12,
                            fontSize: "1.1rem",
                            flexGrow: 1,
                            borderRadius: 8,
                            border: "1px solid #004d40",
                            outline: "none",
                            boxShadow: "inset 0 2px 5px rgba(0, 77, 64, 0.3)",
                            color: "#004d40",
                            backgroundColor: "#e0f2f1",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "14px 36px",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            borderRadius: 8,
                            border: "none",
                            backgroundColor: "#00796b",
                            color: "#e0f2f1",
                            cursor: "pointer",
                            boxShadow: "0 4px 10px rgba(0, 121, 107, 0.4)",
                            transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                            userSelect: "none",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#004d40";
                            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0, 77, 64, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#00796b";
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 121, 107, 0.4)";
                        }}
                    >
                        Analyze
                    </button>
                </div>
            </form>

            {loading && <div style={spinnerStyle}/>}
            {error && (
                <p
                    style={{
                        color: "#ff6b6b", // a soft red for error
                        textAlign: "center",
                        marginBottom: 20,
                        fontWeight: "600",
                    }}
                >
                    {error}
                </p>
            )}

            {sortedArticles.length !== 0 && (
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        backgroundColor: "#e0f2f1",
                        color: "#004d40",
                        borderRadius: 8,
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0, 77, 64, 0.2)",
                    }}
                >
                    <thead>
                    <tr style={{backgroundColor: "#00796b", color: "#e0f7fa", cursor: "pointer"}}>
                        <th style={{padding: "12px 16px"}} onClick={() => handleSort("title")}>
                            Title {sortBy === "title" ? (sortAsc ? "↑" : "↓") : ""}
                        </th>
                        <th style={{padding: "12px 16px"}} onClick={() => handleSort("sentiment")}>
                            Sentiment {sortBy === "sentiment" ? (sortAsc ? "↑" : "↓") : ""}
                        </th>
                        <th style={{padding: "12px 16px"}} onClick={() => handleSort("score")}>
                            Score {sortBy === "score" ? (sortAsc ? "↑" : "↓") : ""}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedArticles.map((article, idx) => (
                        <tr
                            key={idx}
                            style={{
                                borderTop: "1px solid #b2dfdb",
                                backgroundColor: idx % 2 === 0 ? "#e0f7fa" : "#b2dfdb",
                            }}
                        >
                            <td style={{padding: "10px 16px"}}>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: "#00796b",
                                        fontWeight: 600,
                                        textDecoration: "none",
                                    }}
                                >
                                    {article.title}
                                </a>
                            </td>
                            <td style={{padding: "10px 16px"}}>{article.sentiment}</td>
                            <td style={{padding: "10px 16px"}}>
                                {"score" in article ? (article as any).score.toFixed(3) : "N/A"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}


            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
        </div>
    );
};

export default Analyzer;
