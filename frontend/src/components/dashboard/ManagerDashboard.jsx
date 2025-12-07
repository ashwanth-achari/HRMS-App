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

const ManagerDashboard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <StatCard label="Team Size" value="18" />
        <StatCard label="Present Today" value="16" subtitle="2 on approved leave" />
        <StatCard label="Avg Performance" value="4.2 / 5" subtitle="Last review cycle" />
      </section>

      <section
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Upcoming Actions</div>
        <ul style={{ fontSize: "0.85rem", color: "#4b5563", paddingLeft: "1rem" }}>
          <li>3 performance reviews due this week.</li>
          <li>2 leave requests pending your approval.</li>
          <li>1 probation confirmation due on Friday.</li>
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
          Recruitment – Roles You Own
        </div>
        <div style={{ fontSize: "0.85rem", color: "#4b5563" }}>
          <p>Senior MERN Developer – 5 candidates in pipeline (2 shortlisted by AI).</p>
          <p>QA Engineer – 3 candidates awaiting your feedback.</p>
        </div>
      </section>
    </div>
  );
};

export default ManagerDashboard;
