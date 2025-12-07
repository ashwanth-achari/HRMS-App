import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EmployeeDashboard from "../components/dashboard/EmployeeDashboard";

const DashboardPage = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div style={{ padding: "2rem" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <Layout>
      {role === "ADMIN" ? <AdminDashboard /> : <EmployeeDashboard />}
    </Layout>
  );
};

export default DashboardPage;
