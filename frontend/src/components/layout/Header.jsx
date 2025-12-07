import React from "react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const {
    user,
    firebaseUser,
    role,         // effective role (real or viewAs)
    realRole,     // actual backend role
    viewAsRole,
    setViewAsRole,
    logout,
  } = useAuth();

  // Prefer backend name → firebase displayName → email → "Guest"
  const displayName =
    user?.name ||
    firebaseUser?.displayName ||
    user?.email ||
    firebaseUser?.email ||
    "Guest";

  const handleViewAsChange = (e) => {
    const value = e.target.value;
    setViewAsRole(value === "" ? null : value);
  };

  // Real role from backend
  const isAdmin = realRole === "MANAGEMENT_ADMIN";
  const isManager = realRole === "SENIOR_MANAGER";
  const isRecruiter = realRole === "HR_RECRUITER";

  // Decide view-as options based on realRole (hierarchy)
  let viewAsOptions = [];

  if (isAdmin) {
    viewAsOptions = [
      { value: "", label: "View as: Admin (default)" },
      { value: "SENIOR_MANAGER", label: "Senior Manager" },
      { value: "HR_RECRUITER", label: "HR Recruiter" },
      { value: "EMPLOYEE", label: "Employee" },
    ];
  } else if (isManager) {
    viewAsOptions = [
      { value: "", label: "View as: Senior Manager (default)" },
      { value: "HR_RECRUITER", label: "HR Recruiter" },
      { value: "EMPLOYEE", label: "Employee" },
    ];
  } else if (isRecruiter) {
    viewAsOptions = [
      { value: "", label: "View as: Recruiter (default)" },
      { value: "EMPLOYEE", label: "Employee" },
    ];
  }
  // Employees / others → no view-as dropdown

  return (
    <header
      style={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
      }}
    >
      {/* Left: Logo + App name */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#1d4ed8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
          }}
        >
          H
        </div>
        <div>
          <div style={{ fontWeight: 700 }}>HRMS</div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Smart Talent & Employee Hub
          </div>
        </div>
      </div>

      {/* Right side: user info + view as + logout */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* User info */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            {displayName}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
            Role: {role || "UNASSIGNED"}
          </div>
          {realRole && realRole !== role && (
            <div style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
              Real role: {realRole}
            </div>
          )}
        </div>

        {/* View-as dropdown (only for non-employee roles) + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {viewAsOptions.length > 0 && (
            <select
              value={viewAsRole || ""}
              onChange={handleViewAsChange}
              style={{
                fontSize: "0.8rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                background: "#ffffff",
              }}
            >
              {viewAsOptions.map((opt) => (
                <option key={opt.value || "default"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={logout}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
