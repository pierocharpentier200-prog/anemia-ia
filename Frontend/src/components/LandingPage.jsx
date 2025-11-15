import React from "react";
import { useNavigate } from "react-router-dom";
import Matraz from "../assets/matraz.png";
import Globulos from "../assets/globulos_rojos.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative font-sans">

      {/* HERO */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-red-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-[600px] h-[600px] rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative z-10 container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-2 rounded-full text-sm">
              <span>🩸</span> Detección temprana de anemia
            </span>

            <h1 className="text-6xl font-extrabold leading-tight mb-4 text-gray-900">
              Diagnóstico inteligente:
            </h1>

            <h1 className="text-6xl font-extrabold leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                Anemia detectada a tiempo
              </span>
            </h1>

            <p className="text-lg text-gray-600">
              Sistema avanzado de prediagnóstico de anemia con recomendaciones personalizadas para niveles óptimos de hemoglobina.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/analisis")}
                className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg"
              >
                <img src={Matraz} className="w-6 h-6" alt="matraz" />
                Comenzar Análisis
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("info");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-full border-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                Saber más
              </button>
            </div>

            <div className="text-sm text-blue-800 bg-blue-50 border border-blue-100 p-4 rounded-xl">
              <b>Importante:</b> herramienta de prediagnóstico, no reemplaza la consulta médica profesional.
            </div>
          </div>

            <div className="relative">
                <img
                    src="https://images.unsplash.com/photo-1631558556820-89123ea1ef89?q=85&auto=format&fit=crop&w=1200"
                    alt="Análisis médico"
                    className="w-full h-[460px] object-cover rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
            </div>
        </div>
      </section>

      {/* INFO */}
      <section id="info" className="py-24 bg-white">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
              ¿Qué es la Anemia?
            </h2>
            <p className="text-gray-600 mb-8">
              La anemia ocurre cuando no hay suficientes glóbulos rojos sanos o hemoglobina para transportar oxígeno a los tejidos del cuerpo.
            </p>

            <div className="space-y-6">

              <div className="p-6 rounded-2xl bg-red-50 border border-red-100 shadow-md">
                <div className="text-3xl mb-2">🩸</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Hemoglobina Baja</h3>
                <p className="text-gray-600">
                  Niveles bajos pueden causar fatiga y debilidad.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100 shadow-md">
                <div className="text-3xl mb-2">💗</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Síntomas Comunes</h3>
                <p className="text-gray-600">
                  Cansancio, mareos, manos frías y palidez.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 shadow-md">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Prevención</h3>
                <p className="text-gray-600">
                  Dieta rica en hierro, vitamina B12 y ácido fólico.
                </p>
              </div>

            </div>
          </div>

          {/* IMG - Glóbulos Rojos */}
          <div className="relative">
            <img
                src={Globulos}
                alt="Glóbulos rojos"
                className="w-full h-[480px] object-cover rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-pink-50 text-center flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-4">Comienza tu análisis ahora</h2>
        <p className="text-gray-600 mb-8">Es rápido y gratuito</p>

        <button
          onClick={() => navigate("/analisis")}
          className="flex items-center gap-2 px-10 py-5 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-2xl"
        >
          <img src={Matraz} className="w-6 h-6" alt="matraz" />
          Realizar Análisis Gratis
        </button>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center py-8">
        <p className="text-gray-400">2025 Sistema de Detección de Anemia</p>
        <p className="text-gray-500 text-sm mt-1">Herramienta de apoyo, no sustituye diagnóstico médico.</p>
      </footer>

    </div>
  );
}
