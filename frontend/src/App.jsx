import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import KilasyPage from "./pages/KilasyPage";
import RegistrePage from "./pages/RegistrePage";
import StatsPage from "./pages/StatsPage";
import "./app.css";

export default function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kilasy" element={<KilasyPage />} />
          <Route path="/registre" element={<RegistrePage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </AdminLayout>
    </BrowserRouter>
  );
}
