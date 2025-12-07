import React from "react";

const StatCard = ({ label, value, subtitle }) => (
  <div
    style={{
      padding: "1rem",
      borderRadius: "0.75rem",
      background: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      flex: 1,
      minWidth: "160px",
    }}
  >
    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{label}</div>
    <div style={{ marginTop: "0.25rem", fontSize: "1.25rem", fontWeight: 700 }}>
      {value}
    </div>
    {subtitle && (
      <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#9ca3af" }}>
        {subtitle}
      </div>
    )}
  </div>
);

const RecruiterDashboard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <StatCard label="Open Positions" value="9" />
        <StatCard label="Total Applicants" value="132" />
        <StatCard label="In Screening" value="47" />
        <StatCard label="Offers Extended" value="3" />
      </section>

      <section
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          AI Resume Screening Highlights
        </div>
        <ul style={{ fontSize: "0.85rem", color: "#4b5563", paddingLeft: "1rem" }}>
          <li>Top 5 MERN candidates scored above 85/100.</li>
          <li>3 candidates flagged for potential culture mismatch based on responses.</li>
          <li>Avg time-in-stage for Screening: 2.4 days.</li>
        </ul>
      </section>

      <section
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
          Pipeline Summary
        </div>
        <div
          style={{
            borderRadius: "0.5rem",
            border: "1px dashed #d1d5db",
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            color: "#9ca3af",
          }}
        >
          [Kanban / Funnel Chart Placeholder]
        </div>
      </section>
    </div>
  );
};

export default RecruiterDashboard;
