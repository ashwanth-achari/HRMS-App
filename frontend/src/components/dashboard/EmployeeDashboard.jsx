import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Card = ({ title, value, subtitle }) => (
  <div
    style={{
      padding: "1rem",
      borderRadius: "0.75rem",
      background: "#ffffff",
      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      flex: 1,
      minWidth: "180px",
    }}
  >
    <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>{title}</div>
    <div style={{ marginTop: "0.35rem", fontSize: "1.2rem", fontWeight: 700 }}>
      {value}
    </div>
    {subtitle && (
      <div style={{ marginTop: "0.25rem", fontSize: "0.75rem", color: "#9ca3af" }}>
        {subtitle}
      </div>
    )}
  </div>
);

const EmployeeDashboard = () => {
  const { firebaseUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    attendanceThisMonth: null,
    lastPayroll: null,
  });
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!firebaseUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = await firebaseUser.getIdToken();

        const res = await fetch(`${API_BASE_URL}/api/dashboard/employee`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load employee dashboard");
        }

        const data = await res.json();
        setSummary({
          attendanceThisMonth: data?.summaryCards?.attendanceThisMonth || null,
          lastPayroll: data?.summaryCards?.lastPayroll || null,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load your latest data. Showing placeholders.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [firebaseUser]);

  const { attendanceThisMonth, lastPayroll } = summary;

  // Prepare display values with graceful fallback
  const attendanceValue = attendanceThisMonth
    ? `${attendanceThisMonth.percentage}%`
    : loading
    ? "Loading..."
    : "—";

  const attendanceSubtitle = attendanceThisMonth
    ? `${attendanceThisMonth.presentDays} / ${attendanceThisMonth.workingDays} working days`
    : "Attendance analytics coming soon";

  const payrollValue = lastPayroll
    ? `₹ ${lastPayroll.amount.toLocaleString("en-IN")}`
    : loading
    ? "Loading..."
    : "No payroll data";

  const payrollSubtitle = lastPayroll
    ? `Credited on ${new Date(lastPayroll.creditedOn).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}`
    : "Latest payroll info";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Summary cards */}
      <section style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Card
          title="My Attendance (This Month)"
          value={attendanceValue}
          subtitle={attendanceSubtitle}
        />

        {/* Leaves – still placeholder / upcoming feature */}
        <Card title="Leaves Remaining" value="—" subtitle="Leave balance coming soon" />

        <Card
          title="Last Payroll"
          value={payrollValue}
          subtitle={payrollSubtitle}
        />
      </section>

      {/* Error banner if something failed */}
      {error && (
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            background: "#fef2f2",
            color: "#b91c1c",
            fontSize: "0.8rem",
          }}
        >
          {error}
        </div>
      )}

      {/* Below sections still static for now */}
      <section
        style={{
          padding: "1rem",
          borderRadius: "0.75rem",
          background: "#ffffff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>My Recent Activity</div>
        <ul style={{ fontSize: "0.85rem", color: "#4b5563", paddingLeft: "1rem" }}>
          <li>✅ Checked in today (real analytics integration WIP)</li>
          <li>✅ Performance review section planned as next feature</li>
          <li>🕒 Leave requests & approvals will be integrated later</li>
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
        <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>My Performance Trend</div>
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
          [Performance chart will use real data in the next iteration]
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
