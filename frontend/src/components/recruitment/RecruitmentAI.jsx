import React, { useState } from "react";

const mockCandidates = [
  {
    id: "CAND-001",
    name: "Rahul Sharma",
    role: "MERN Developer",
    experience: "3.5",
    status: "Applied",
    resumeUrl: "https://example.com/resumes/rahul.pdf"
  },
  {
    id: "CAND-002",
    name: "Ananya Rao",
    role: "MERN Developer",
    experience: "2",
    status: "Screened",
    resumeUrl: "https://example.com/resumes/ananya.pdf"
  },
  {
    id: "CAND-003",
    name: "Vikram Singh",
    role: "Frontend Engineer",
    experience: "4",
    status: "Interview",
    resumeUrl: "https://example.com/resumes/vikram.pdf"
  }
];

const RecruitmentAI = () => {
  const [activeCard, setActiveCard] = useState("RESUME"); // RESUME | VIDEO
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Simple chat widget state
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hi! I can help you analyze candidates using AI." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput.trim() };

    // For now, just echo with a dummy AI reply
    const aiMsg = {
      sender: "bot",
      text: "AI response placeholder – hook this to your LLM backend."
    };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setChatInput("");
  };

  const handleEvaluateCandidate = async () => {
    if (!selectedCandidate) return;

    setEvaluating(true);
    setEvaluationResult(null);

    try {
      const payload = {
        candidate_id: selectedCandidate.id,
        resume_url: selectedCandidate.resumeUrl
      };

      const res = await fetch("http://localhost:8000/ocr/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("OCR API error");
      }

      const data = await res.json();
      setEvaluationResult(data);
    } catch (err) {
      console.error(err);
      setEvaluationResult({
        error: "Failed to evaluate resume. Check OCR service."
      });
    } finally {
      setEvaluating(false);
    }
  };

  const renderResumeScreening = () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {/* Left: table */}
      <div
        style={{
          flex: 2,
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          overflowX: "auto"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>
          Applied Candidates
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem"
          }}
        >
          <thead>
            <tr style={{ background: "#f3f4f6" }}>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Role</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Exp (yrs)</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockCandidates.map((cand, idx) => {
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <tr
                  key={cand.id}
                  onClick={() => {
                    setSelectedCandidate(cand);
                    setEvaluationResult(null);
                  }}
                  style={{
                    background: isSelected ? "#e5edff" : idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                    cursor: "pointer"
                  }}
                >
                  <td style={{ padding: "0.5rem" }}>{cand.id}</td>
                  <td style={{ padding: "0.5rem" }}>{cand.name}</td>
                  <td style={{ padding: "0.5rem" }}>{cand.role}</td>
                  <td style={{ padding: "0.5rem" }}>{cand.experience}</td>
                  <td style={{ padding: "0.5rem" }}>{cand.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Right: candidate bio + evaluate */}
      <div
        style={{
          flex: 1,
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          minWidth: "260px"
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Candidate Snapshot</div>
        {!selectedCandidate && (
          <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
            Select a candidate from the table to view details.
          </div>
        )}

        {selectedCandidate && (
          <>
            <div style={{ marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 600 }}>{selectedCandidate.name}</div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                {selectedCandidate.role} · {selectedCandidate.experience} years
              </div>
              <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                Status: {selectedCandidate.status}
              </div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "#4b5563",
                marginBottom: "0.75rem",
                background: "#f9fafb",
                borderRadius: "0.5rem",
                padding: "0.5rem 0.75rem"
              }}
            >
              <strong>Short Bio (example):</strong>
              <br />
              MERN developer with hands-on experience in React, Node.js and MongoDB.
              Built multiple full-stack apps and comfortable with REST APIs & Git workflows.
            </div>

            <button
              onClick={handleEvaluateCandidate}
              disabled={evaluating}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                borderRadius: "0.5rem",
                border: "none",
                background: evaluating ? "#93c5fd" : "#1d4ed8",
                color: "#ffffff",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: evaluating ? "not-allowed" : "pointer",
                marginBottom: "0.75rem"
              }}
            >
              {evaluating ? "Evaluating..." : "Evaluate with OCR AI"}
            </button>

            {evaluationResult && (
              <div
                style={{
                  fontSize: "0.8rem",
                  color: evaluationResult.error ? "#b91c1c" : "#065f46",
                  background: evaluationResult.error ? "#fee2e2" : "#ecfdf5",
                  borderRadius: "0.5rem",
                  padding: "0.5rem 0.75rem",
                  maxHeight: "160px",
                  overflowY: "auto"
                }}
              >
                {evaluationResult.error ? (
                  evaluationResult.error
                ) : (
                  <>
                    <div><strong>Name:</strong> {evaluationResult.name}</div>
                    <div><strong>Email:</strong> {evaluationResult.email}</div>
                    <div><strong>Skills:</strong> {evaluationResult.skills?.join(", ")}</div>
                    <div><strong>Experience:</strong> {evaluationResult.experience_years} years</div>
                    <div style={{ marginTop: "0.35rem" }}>
                      <strong>Summary:</strong> {evaluationResult.summary}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderVideoScreening = () => (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
        Video Screening (Placeholder)
      </div>
      <div
        style={{
          borderRadius: "0.5rem",
          border: "1px dashed #d1d5db",
          height: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          color: "#9ca3af"
        }}
      >
        [Embed video interviews, AI sentiment analysis, speech-to-text, etc.]
      </div>
    </div>
  );

  const renderChatWidget = () => (
    <div
      style={{
        flex: 1,
        padding: "1rem",
        borderRadius: "0.75rem",
        background: "#ffffff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        minHeight: "260px"
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
        AI Talent Assistant (Chat & Voice)
      </div>
      <div
        style={{
          flex: 1,
          borderRadius: "0.5rem",
          border: "1px solid #e5e7eb",
          padding: "0.5rem",
          overflowY: "auto",
          marginBottom: "0.5rem",
          background: "#f9fafb"
        }}
      >
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "0.35rem",
              textAlign: msg.sender === "user" ? "right" : "left"
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.35rem 0.55rem",
                borderRadius: "0.75rem",
                background:
                  msg.sender === "user" ? "#1d4ed8" : "#e5e7eb",
                color: msg.sender === "user" ? "#ffffff" : "#111827",
                fontSize: "0.8rem"
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: "0.35rem" }}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask AI about a candidate or job..."
          style={{
            flex: 1,
            padding: "0.45rem 0.6rem",
            borderRadius: "0.5rem",
            border: "1px solid #d1d5db",
            fontSize: "0.8rem"
          }}
        />
        <button
          onClick={handleChatSend}
          style={{
            padding: "0.45rem 0.75rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "#1d4ed8",
            color: "#ffffff",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
      <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "#9ca3af" }}>
        Voice interaction: hook this input to WebRTC / browser audio + STT → your AI backend.
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Top cards */}
      <section
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setActiveCard("RESUME")}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "none",
            cursor: "pointer",
            background: activeCard === "RESUME" ? "#1d4ed8" : "#ffffff",
            color: activeCard === "RESUME" ? "#ffffff" : "#111827",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            textAlign: "left"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
            Resume Screening
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            AI-assisted OCR + semantic analysis of candidate CVs.
          </div>
        </button>

        <button
          onClick={() => setActiveCard("VIDEO")}
          style={{
            flex: 1,
            minWidth: "200px",
            padding: "1rem",
            borderRadius: "0.75rem",
            border: "none",
            cursor: "pointer",
            background: activeCard === "VIDEO" ? "#1d4ed8" : "#ffffff",
            color: activeCard === "VIDEO" ? "#ffffff" : "#111827",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            textAlign: "left"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>
            Video Screening
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
            Capture interviews, run AI sentiment & communication analysis.
          </div>
        </button>
      </section>

      {/* Main content + chat */}
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ flex: 2, minWidth: "320px" }}>
          {activeCard === "RESUME" ? renderResumeScreening() : renderVideoScreening()}
        </div>
        {renderChatWidget()}
      </section>
    </div>
  );
};

export default RecruitmentAI;
