import React, { useState, useEffect } from "react";
import ForgeSimulator from "./components/ForgeSimulator";
import VeyronSimulator from "./components/VeyronSimulator";
import ChatAssistant from "./components/ChatAssistant";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import "./styles.css";
 
export default function App() {
  const [activeSimulator, setActiveSimulator] = useState(null);
 
  // ✅ Initialize from localStorage so it persists on refresh
  const [likes, setLikes] = useState(() =>
    parseInt(localStorage.getItem("likes") || "0", 10)
  );
  const [unlikes, setUnlikes] = useState(() =>
    parseInt(localStorage.getItem("unlikes") || "0", 10)
  );
  const [liked, setLiked] = useState(() =>
    localStorage.getItem("liked") === "true"
  );
  const [disliked, setDisliked] = useState(() =>
    localStorage.getItem("disliked") === "true"
  );
 
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("likes", likes);
    localStorage.setItem("unlikes", unlikes);
    localStorage.setItem("liked", liked);
    localStorage.setItem("disliked", disliked);
  }, [likes, unlikes, liked, disliked]);
 
  const handleSimulatorClick = (sim) => setActiveSimulator(sim);
  const handleBack = () => setActiveSimulator(null);
 
  // Toggle Like
  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      if (disliked) {
        setUnlikes(unlikes - 1);
        setDisliked(false);
      }
    }
  };
 
  // Toggle Dislike
  const handleDislike = () => {
    if (!disliked) {
      setUnlikes(unlikes + 1);
      setDisliked(true);
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      }
    }
  };
 
  return (
    <div className="min-h-screen p-4 app-container">
      {activeSimulator && (
        <button
          className="back-button"
          onClick={handleBack}
          aria-label="Go back to simulator selection"
        >
          <FaArrowLeft />
        </button>
      )}
 
      {!activeSimulator && (
        <header
          style={{
            width: "100%",
            position: "relative",
            textAlign: "center",
            marginTop: "32px",
            zIndex: 10,
          }}
        >
          <h1 className="welcome-text" style={{ marginTop: 0 }}>
            Forge & Veyron Currency Simulator Hub
          </h1>
          <p className="welcome-subtitle" style={{ marginTop: "-10px" }}>
            Powered by Enhance Quest
          </p>
        </header>
      )}
      {/* Logo placed between header and welcome paragraph, size and spacing adjusted to fit UI and avoid scroll */}
      {!activeSimulator && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '2px 0 0 0' }}>
          <img src="/Designer.png" alt="Logo" style={{ width: '100px', height: '100px', borderRadius: '20px', display: 'block' }} />
        </div>
      )}
 
      <main className="center-container">
        {!activeSimulator && (
          <>
            <section
              style={{
                textAlign: "center",
                marginTop: "110px",
                marginBottom: "18px",
              }}
            >
              <p
                className="welcome-paragraph"
                style={{
                  display: "inline-block",
                  maxWidth: "900px",
                  color: "var(--muted)",
                  margin: 0,
                }}
              >
                Effortlessly calculate bet ranges across multiple currencies—no
                manual conversions required. Select a simulator type, upload a
                bet settings file from the release, and click{" "}
                <strong>Calculate</strong> to view results instantly.
              </p>
            </section>
 
            <section className="welcome-section">
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "28px",
                  color: "var(--muted)",
                }}
              >
                Choose a simulator from the menu.
              </p>
              <div className="tabs">
                <button
                  onClick={() => handleSimulatorClick("forge")}
                  aria-label="Open Forge Simulator"
                >
                  Forge
                </button>
                <button
                  onClick={() => handleSimulatorClick("veyron")}
                  aria-label="Open Veyron Simulator"
                >
                  Veyron
                </button>
              </div>
            </section>
          </>
        )}
 
        {activeSimulator === "forge" && <ForgeSimulator />}
        {activeSimulator === "veyron" && <VeyronSimulator />}
        {activeSimulator === "chat" && <ChatAssistant />}
      </main>
 
      <footer className="like-dislike">
        <button
          onClick={handleLike}
          aria-label="Like this simulator"
          style={{ color: liked ? "blue" : "inherit" }}
        >
          <FaThumbsUp /> {likes}
        </button>
        <button
          onClick={handleDislike}
          aria-label="Dislike this simulator"
          style={{ color: disliked ? "red" : "inherit" }}
        >
          <FaThumbsDown /> {unlikes}
        </button>
      </footer>
 
      <ChatAssistant />
    </div>
  );
}
