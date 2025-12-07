import React from "react";

const StatCard = ({ label, value }) => (
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
  </div>
);

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <section
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            marginBottom: "0.75rem",
            fontWeight: 600,
            fontSize: "0.95rem",
          }}
        >
          Filters
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            fontSize: "0.85rem",
          }}
        >
          <select>
            <option>All Departments</option>
            <option>Engineering</option>
            <option>HR</option>
            <option>Finance</option>
          </select>
          <select>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
          </select>
        </div>
      </section>

      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <StatCard label="Total Employees" value="5120" />
        <StatCard label="Active Employees" value="4987" />
        <StatCard label="On Leave Today" value="73" />
        <StatCard label="Open Positions" value="18" />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
          gap: "1rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "#ffffff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            minHeight: "220px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            Company-wide Attendance Trend
          </div>
          <div
            style={{
              borderRadius: "0.5rem",
              border: "1px dashed #d1d5db",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              color: "#9ca3af",
            }}
          >
            [Chart Placeholder]
          </div>
        </div>

        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "#ffffff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            minHeight: "220px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
            Department-wise Headcount
          </div>
          <div
            style={{
              borderRadius: "0.5rem",
              border: "1px dashed #d1d5db",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              color: "#9ca3af",
            }}
          >
            [Pie/Bar Chart Placeholder]
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
