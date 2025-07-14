import React from "react";
import { useNavigate } from "react-router-dom";
const Welcome: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/analyze");
    };

    return (
        <div
            style={{
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
            <h1 style={{ fontSize: "2.5rem", marginBottom: 16 }}>
                Welcome to Sentiment Analyzer
            </h1>
            <p style={{ fontSize: "1.25rem", marginBottom: 40, maxWidth: 400 }}>
                Click the button below to start analyzing bank news sentiment.
            </p>
            <button
                onClick={handleClick}
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
                Go to Analyzer
            </button>
        </div>
    );
};

export default Welcome;
