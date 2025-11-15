// src/components/DetectionSystem.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Assets
import Globulos from "../assets/globulos_rojos.jpg";
import Matraz from "../assets/matraz.png";
import Vegetales from "../assets/vegetales_verdes.jpg";
import Proteinas from "../assets/proteinas.jpg";
import Legumbres from "../assets/legumbres.jpg";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
const API = `${BACKEND_URL}/api`;

export default function DetectionSystem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [form, setForm] = useState({
    genero: "",
    hemoglobina: "",
    mch: "",
    mchc: "",
    mcv: "",
  });

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetTodo = () => {
    setResultado(null);
    setForm({ genero: "", hemoglobina: "", mch: "", mchc: "", mcv: "" });
  };

  const analizar = async (e) => {
    e.preventDefault();
    const { genero, hemoglobina, mch, mchc, mcv } = form;
    if (!genero || !hemoglobina || !mch || !mchc || !mcv) {
      alert("Completa todos los campos.");
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const { data } = await axios.post(`${API}/analizar-anemia`, {
        genero,
        hemoglobina: parseFloat(hemoglobina),
        mch: parseFloat(mch),
        mchc: parseFloat(mchc),
        mcv: parseFloat(mcv),
      });
      setResultado(data);
    } catch (err) {
      console.error(err);
      alert("Error al procesar el análisis");
    } finally {
      setLoading(false);
    }
  };

  // Recomendaciones SIN anemia (1..5)
  const recomendacionesSinAnemia = [
    "Mantén una dieta balanceada rica en hierro (carnes rojas, espinacas, lentejas)",
    "Consume alimentos ricos en vitamina C para mejorar la absorción de hierro",
    "Realiza chequeos médicos anuales de rutina",
    "Mantén un estilo de vida activo con ejercicio regular",
    "Hidrátate adecuadamente (8 vasos de agua al día)",
  ];

  // Recomendaciones CON anemia (1..10) — tal cual en tus capturas
  const recomendacionesAnemia = [
    "IMPORTANTE: Consulta con un médico para un diagnóstico profesional",
    "Aumenta el consumo de alimentos ricos en hierro: carnes rojas magras, hígado, pollo",
    "Consume vegetales de hojas verdes: espinacas, acelgas, brócoli",
    "Incorpora legumbres: lentejas, garbanzos, frijoles negros",
    "Incluye alimentos con vitamina C: naranjas, fresas, kiwi (mejora absorción de hierro)",
    "Agrega huevos y frutos secos a tu dieta diaria",
    "Evita el café y té durante las comidas (interfieren con absorción de hierro)",
    "Considera suplementos de hierro solo bajo supervisión médica",
    "Descansa adecuadamente (7-8 horas diarias)",
    "Realiza seguimiento con análisis de sangre regulares",
  ];

  const fmt = (v) => (typeof v === "number" ? String(v) : (v ?? "").toString());
  const valoresUsados = resultado?.valores_ingresados ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-rose-50/60 to-pink-50">
      {/* Header */}
      <header className="w-full border-b bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-2xl font-semibold text-red-600">
            Sistema de Detección de Anemia
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        {/* FORMULARIO */}
        <section className="mx-auto max-w-4xl">
          <div className="rounded-3xl overflow-hidden shadow-lg border bg-white">
            {/* Banner */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white flex items-center gap-3">
              <img src={Matraz} alt="matraz" className="w-7 h-7" />
              <div>
                <h2 className="text-xl font-bold">Análisis de Valores Sanguíneos</h2>
                <p className="text-white/90 text-sm">
                  Ingresa tus valores para obtener un análisis detallado
                </p>
              </div>
            </div>

            <form onSubmit={analizar} className="p-8 space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Género</label>
                <select
                  name="genero"
                  value={form.genero}
                  onChange={onChange}
                  className="w-full rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  <option value="">Selecciona tu género</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Hemoglobina (g/dL)
                  </label>
                  <input
                    name="hemoglobina"
                    type="number"
                    step="0.1"
                    placeholder="ej: 13.5"
                    value={form.hemoglobina}
                    onChange={onChange}
                    className="w-full rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango normal: 12–17 g/dL
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    MCH — Hemoglobina Corpuscular Media (pg)
                  </label>
                  <input
                    name="mch"
                    type="number"
                    step="0.1"
                    placeholder="ej: 29.5"
                    value={form.mch}
                    onChange={onChange}
                    className="w-full rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango normal: 27–33 pg
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    MCHC — Concentración de Hemoglobina Corpuscular Media (g/dL)
                  </label>
                  <input
                    name="mchc"
                    type="number"
                    step="0.1"
                    placeholder="ej: 33.5"
                    value={form.mchc}
                    onChange={onChange}
                    className="w-full rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango normal: 32–36 g/dL
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    MCV — Volumen Corpuscular Medio (fL)
                  </label>
                  <input
                    name="mcv"
                    type="number"
                    step="0.1"
                    placeholder="ej: 88.0"
                    value={form.mcv}
                    onChange={onChange}
                    className="w-full rounded-xl border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Rango normal: 80–100 fL
                  </p>
                </div>
              </div>

              {/* Importante */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
                <b>Importante:</b> Este análisis es orientativo y no reemplaza una
                consulta médica profesional.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-4 text-white font-semibold shadow-lg hover:from-rose-600 hover:to-pink-600 transition"
              >
                <span className="inline-flex items-center gap-3">
                  <img src={Matraz} alt="matraz" className="w-6 h-6" />
                  {loading ? "Analizando..." : "Analizar Resultados"}
                </span>
              </button>
            </form>
          </div>
        </section>

        {/* RESULTADOS */}
        {resultado && (
          <section className="mt-12">
            <div
              className={
                resultado.tiene_anemia
                  ? "bg-rose-50 border border-rose-200 rounded-3xl shadow-xl p-8"
                  : "bg-green-50 border border-green-200 rounded-3xl shadow-xl p-8"
              }
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={
                    "flex items-center justify-center w-12 h-12 rounded-xl text-2xl shadow " +
                    (resultado.tiene_anemia
                      ? "bg-rose-100 text-rose-700"
                      : "bg-green-100 text-green-700")
                  }
                >
                  ✓
                </div>
                <div>
                  <h2
                    className={
                      "text-3xl font-extrabold " +
                      (resultado.tiene_anemia ? "text-rose-700" : "text-green-700")
                    }
                  >
                    {resultado.tiene_anemia ? "Anemia Detectada" : "Sin Anemia"}
                  </h2>
                  <p
                    className={
                      (resultado.tiene_anemia
                        ? "text-rose-900/80"
                        : "text-green-900/80") + " text-lg"
                    }
                  >
                    {resultado.mensaje || ""}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Valores ingresados */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Valores Ingresados:</h3>
                  <div className="space-y-3">
                    {[
                      ["Género", valoresUsados?.genero],
                      ["Hemoglobina", `${fmt(valoresUsados?.hemoglobina)} g/dL`],
                      ["MCH — Hemoglobina Corpuscular Media", `${fmt(valoresUsados?.mch)} pg`],
                      [
                        "MCHC — Concentración de Hemoglobina Corpuscular Media",
                        `${fmt(valoresUsados?.mchc)} g/dL`,
                      ],
                      ["MCV — Volumen Corpuscular Medio", `${fmt(valoresUsados?.mcv)} fL`],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between bg-white rounded-2xl shadow border px-5 py-3"
                      >
                        <span className="text-gray-600 font-medium">{label}:</span>
                        <span className="font-bold text-gray-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnóstico */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Diagnóstico:</h3>

                  <div
                    className={
                      "rounded-xl border p-5 text-center mb-5 " +
                      (resultado.tiene_anemia
                        ? "bg-rose-100 border-rose-300"
                        : "bg-green-100 border-green-300")
                    }
                  >
                    <p
                      className={
                        (resultado.tiene_anemia ? "text-rose-700/80" : "text-green-700/80") +
                        " text-sm font-medium"
                      }
                    >
                      Resultado
                    </p>
                    <p
                      className={
                        (resultado.tiene_anemia ? "text-rose-800" : "text-green-800") +
                        " text-3xl font-extrabold"
                      }
                    >
                      {resultado.tiene_anemia ? "Con Anemia" : "Sin Anemia"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border p-2 shadow-md">
                    <img
                      src={Globulos}
                      alt="Glóbulos rojos"
                      className="rounded-xl w-full h-[230px] object-cover shadow"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recomendaciones + Guía Nutricional */}
            <div className="mt-10 bg-white rounded-3xl shadow-xl border overflow-hidden">
              <div className="bg-blue-50 border-b px-6 py-5">
                <h3 className="text-xl font-bold text-gray-800">
                  Recomendaciones Personalizadas
                </h3>
                <p className="text-gray-600 text-sm">
                  {resultado.tiene_anemia
                    ? "Plan de acción para mejorar tus niveles de hemoglobina"
                    : "Consejos para mantener tus niveles óptimos"}
                </p>
              </div>

              <div className="p-6 space-y-4">
                {(resultado.tiene_anemia ? recomendacionesAnemia : recomendacionesSinAnemia).map(
                  (texto, i) => (
                    <div
                      key={i}
                      className="flex gap-4 border rounded-2xl bg-slate-50 shadow-sm px-4 py-4"
                    >
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-200 text-blue-700 text-sm font-bold">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 font-medium">{texto}</p>
                    </div>
                  )
                )}

                {/* Guía Nutricional */}
                <div className="mt-6 rounded-2xl overflow-hidden border">
                  <div className="bg-green-50 px-6 py-5">
                    <h4 className="text-2xl font-bold text-emerald-800 flex items-center gap-3">
                      <span role="img" aria-label="manzana">🍏</span>
                      Guía Nutricional
                    </h4>
                    <p className="text-emerald-800/70">
                      Alimentos recomendados para combatir la anemia
                    </p>
                  </div>

                  <div className="p-6 grid md:grid-cols-3 gap-6">
                    {/* Vegetales Verdes */}
                    <article className="rounded-2xl overflow-hidden shadow">
                      <div className="h-48 w-full">
                        <img src={Vegetales} alt="Vegetales verdes" className="h-full w-full object-cover" />
                      </div>
                      <div className="bg-white px-6 py-4">
                        <h5 className="text-2xl font-bold text-emerald-800">Vegetales Verdes</h5>
                        <p className="text-gray-600">Espinacas, acelgas, brócoli</p>
                      </div>
                    </article>

                    {/* Proteínas */}
                    <article className="rounded-2xl overflow-hidden shadow">
                      <div className="h-48 w-full">
                        <img src={Proteinas} alt="Proteínas" className="h-full w-full object-cover" />
                      </div>
                      <div className="bg-white px-6 py-4">
                        <h5 className="text-2xl font-bold text-rose-800">Proteínas</h5>
                        <p className="text-gray-600">Carnes rojas, pollo, pescado</p>
                      </div>
                    </article>

                    {/* Legumbres */}
                    <article className="rounded-2xl overflow-hidden shadow">
                      <div className="h-48 w-full">
                        <img src={Legumbres} alt="Legumbres" className="h-full w-full object-cover" />
                      </div>
                      <div className="bg-white px-6 py-4">
                        <h5 className="text-2xl font-bold text-orange-700">Legumbres</h5>
                        <p className="text-gray-600">Lentejas, garbanzos, frijoles</p>
                      </div>
                    </article>
                  </div>

                  {/* Botones */}
                  <div className="px-6 pb-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={resetTodo}
                      className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold shadow-md"
                    >
                      Realizar Nuevo Análisis
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="flex-1 px-6 py-4 rounded-2xl bg-white border text-gray-700 font-semibold hover:bg-gray-50 shadow-sm"
                    >
                      Volver al Inicio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
