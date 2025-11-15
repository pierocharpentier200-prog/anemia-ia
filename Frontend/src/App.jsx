import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "@/components/LandingPage.jsx";
import DetectionSystem from "@/components/DetectionSystem.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analisis" element={<DetectionSystem />} />
        {/* fallback para rutas desconocidas */}
        <Route
          path="*"
          element={
            <div className="p-6">
              <p>Página no encontrada.</p>
              <Link className="text-red-600 underline" to="/">Volver al inicio</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}
