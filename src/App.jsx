import React, { useState } from "react";
import logo from "/logo.png"; // ajustá si tu logo está en otra ruta

// Chart.js
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const HOURLY_RATE_DEFAULT = 92000;

// Normalización y mapa de niveles
function mapScoreToLevel(score) {
  if (score < 80) return "A";
  if (score < 130) return "B";
  if (score < 170) return "C";
  if (score < 230) return "D";
  return "E";
}

// ----------------------
//  SERVICIOS DE SONAR
// ----------------------
const SONAR_PROJECTS = [
  {
    id: "billing-api",
    name: "Billing API",
    description: "Facturación y conciliación de pagos.",
    nivelActual: "C",
    metrics: {
      code_smells: 95,
      open_issues: 12,
      lines: 38000,
      security_hotspots: 3,
      cognitive_complexity: 110,
      coverage: 78,
      duplicated_lines: 2200,
      DeudaTEcnicaHoras: 32,
      rate: HOURLY_RATE_DEFAULT,
    },
  },
  {
    id: "onboarding-web",
    name: "Onboarding Web",
    description: "Portal de alta de clientes.",
    nivelActual: "B",
    metrics: {
      code_smells: 60,
      open_issues: 5,
      lines: 21000,
      security_hotspots: 1,
      cognitive_complexity: 80,
      coverage: 82,
      duplicated_lines: 900,
      DeudaTEcnicaHoras: 28,
      rate: HOURLY_RATE_DEFAULT,
    },
  },
  {
    id: "core-banking-batch",
    name: "Core Banking Batch",
    description: "Procesos contables nocturnos.",
    nivelActual: "D",
    metrics: {
      code_smells: 210,
      open_issues: 40,
      lines: 52000,
      security_hotspots: 9,
      cognitive_complexity: 170,
      coverage: 60,
      duplicated_lines: 4800,
      DeudaTEcnicaHoras: 48,
      rate: HOURLY_RATE_DEFAULT,
    },
  },
  {
    id: "pagos-gateway",
    name: "Gateway de Pagos",
    description: "Orquestación de pagos.",
    nivelActual: "A",
    metrics: {
      code_smells: 30,
      open_issues: 1,
      lines: 16000,
      security_hotspots: 0,
      cognitive_complexity: 70,
      coverage: 90,
      duplicated_lines: 320,
      DeudaTEcnicaHoras: 16,
      rate: HOURLY_RATE_DEFAULT,
    },
  },
  {
    id: "motor-fraude",
    name: "Motor Antifraude",
    description: "Detección de fraude.",
    nivelActual: "E",
    metrics: {
      code_smells: 290,
      open_issues: 70,
      lines: 50000,
      security_hotspots: 15,
      cognitive_complexity: 220,
      coverage: 55,
      duplicated_lines: 6100,
      DeudaTEcnicaHoras: 60,
      rate: HOURLY_RATE_DEFAULT,
    },
  },
];

// Normalización IA
function normalizeMetrics(m) {
  const kloc = Math.max(1, m.lines / 1000);
  const smellsDensity = m.code_smells / kloc;
  const issuesDensity = m.open_issues / kloc;
  const hotspotsDensity = m.security_hotspots / kloc;
  const duplicatedPct = (m.duplicated_lines / m.lines) * 100;
  const coverageGap = Math.max(0, 85 - m.coverage);
  const complexity = m.cognitive_complexity;

  const riskScore =
    smellsDensity * 0.8 +
    issuesDensity * 1.1 +
    hotspotsDensity * 1.5 +
    duplicatedPct * 0.7 +
    complexity * 0.3 +
    coverageGap * 1.0;

  const level = mapScoreToLevel(riskScore);

  return {
    riskScore,
    level,
    duplicatedPct,
    coverageGap,
    complexity,
    hotspotsDensity,
  };
}

// Estimación IA
function estimatePlanFromMetrics(metrics) {
  const norm = normalizeMetrics(metrics);

  let baseEffort;
  if (norm.riskScore < 120)
    baseEffort = 24 + (norm.riskScore / 120) * 16;
  else if (norm.riskScore < 220)
    baseEffort =
      40 + ((norm.riskScore - 120) / 100) * 40;
  else
    baseEffort =
      80 + ((norm.riskScore - 220) / 200) * 120;

  const deudaBase = metrics.DeudaTEcnicaHoras || 32;
  const horasTotales = Math.round(
    Math.max(8, baseEffort * (deudaBase / 32))
  );

  const rate = HOURLY_RATE_DEFAULT;

  const horasRefactor = Math.round(
    horasTotales *
      (0.35 +
        (norm.duplicatedPct > 8 ? 0.1 : 0) +
        (norm.complexity > 120 ? 0.1 : 0))
  );
  const horasPruebas = Math.round(
    horasTotales *
      (0.25 + (norm.coverageGap > 10 ? 0.1 : 0))
  );
  const horasSeguridad = Math.round(
    horasTotales *
      (0.15 + (norm.hotspotsDensity > 0.3 ? 0.1 : 0))
  );
  const horasGestion =
    horasTotales -
    (horasRefactor + horasPruebas + horasSeguridad);

  const costo = rate * horasTotales;

  const riesgoProyectado = norm.riskScore * 0.72;
  const nivelProyectado = mapScoreToLevel(riesgoProyectado);

  return {
    ...norm,
    horasTotales,
    costo,
    horasRefactor,
    horasPruebas,
    horasSeguridad,
    horasGestion,
    nivelProyectado,
    riesgoProyectado,
  };
}

// Radar chart
function getRadarData(metrics) {
  return {
    labels: [
      "Code Smells",
      "Issues",
      "Complejidad",
      "Hotspots",
      "Cobertura",
      "Duplicación",
    ],
    datasets: [
      {
        label: "Perfil del servicio",
        data: [
          metrics.code_smells,
          metrics.open_issues,
          metrics.cognitive_complexity,
          metrics.security_hotspots,
          metrics.coverage,
          metrics.duplicated_lines,
        ],
        backgroundColor: "rgba(56, 189, 248, 0.25)",
        borderColor: "rgba(56, 189, 248, 1)",
        borderWidth: 2,
      },
    ],
  };
}

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { color: "rgba(148, 163, 184, 0.2)" },
      grid: { color: "rgba(148, 163, 184, 0.15)" },
      pointLabels: {
        color: "#e2e8f0",
        font: { size: 11 },
      },
      suggestedMin: 0,
    },
  },
  plugins: {
    legend: { labels: { color: "white" } },
  },
};

// ------------------------------
//      COMPONENTES UI
// ------------------------------
const Card = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-lg p-5">
    <h2 className="text-sm font-semibold text-slate-100">
      {title}
    </h2>
    {subtitle && (
      <p className="text-xs text-slate-400 mb-3">{subtitle}</p>
    )}
    {children}
  </div>
);

const Stat = ({ label, value, helper, tone = "blue" }) => (
  <div className="rounded-xl p-4 border border-slate-700 bg-slate-900/60">
    <div className="text-xs uppercase tracking-wide text-slate-400">
      {label}
    </div>
    <div
      className={
        "text-2xl font-bold mt-1 " +
        (tone === "green"
          ? "text-emerald-300"
          : tone === "amber"
          ? "text-amber-300"
          : tone === "red"
          ? "text-red-300"
          : "text-sky-300")
      }
    >
      {value}
    </div>
    {helper && (
      <div className="text-xs text-slate-500 mt-1">{helper}</div>
    )}
  </div>
);

// ------------------------------
//      PANTALLA SONAR
// ------------------------------
const SonarScreen = ({ onBack, onSelect }) => (
  <div className="min-h-screen bg-slate-950 text-slate-50">
    <header className="border-b border-slate-800 bg-slate-900 p-4 flex justify-between">
      <button
        onClick={onBack}
        className="px-3 py-1.5 bg-slate-700 rounded-md text-xs"
      >
        ← Volver
      </button>
      <h1 className="text-lg font-bold text-sky-300">
        Servidor Sonar (Simulación)
      </h1>
    </header>

    <main className="max-w-5xl mx-auto p-4">
      <div className="grid md:grid-cols-3 gap-4">
        {SONAR_PROJECTS.map((p) => {
          const norm = normalizeMetrics(p.metrics);
          return (
            <div
              key={p.id}
              className="rounded-xl border border-slate-700 bg-slate-900/80 p-4"
            >
              <h3 className="text-slate-200 font-semibold">
                {p.name}
              </h3>
              <p className="text-[11px] text-slate-400 mb-2">
                {p.description}
              </p>

              <div className="text-[11px] text-slate-300 space-y-1">
                <p>
                  <b>Code smells:</b> {p.metrics.code_smells}
                </p>
                <p>
                  <b>Issues abiertos:</b> {p.metrics.open_issues}
                </p>
                <p>
                  <b>Líneas de código:</b>{" "}
                  {p.metrics.lines.toLocaleString()}
                </p>
                <p>
                  <b>Hotspots seguridad:</b>{" "}
                  {p.metrics.security_hotspots}
                </p>
                <p>
                  <b>Complejidad cognitiva:</b>{" "}
                  {p.metrics.cognitive_complexity}
                </p>
                <p>
                  <b>Cobertura:</b> {p.metrics.coverage}%
                </p>
                <p>
                  <b>Líneas duplicadas:</b>{" "}
                  {p.metrics.duplicated_lines.toLocaleString()}
                </p>
                <p>
                  <b>Deuda técnica:</b>{" "}
                  {p.metrics.DeudaTEcnicaHoras} h
                </p>
              </div>

              <p className="text-xs mt-2">
                Nivel actual:{" "}
                <b className="text-sky-300">
                  {p.nivelActual}
                </b>
              </p>

              <p className="text-xs">
                Riesgo técnico:{" "}
                <b
                  className={
                    norm.level === "A"
                      ? "text-emerald-300"
                      : norm.level === "B"
                      ? "text-green-300"
                      : norm.level === "C"
                      ? "text-amber-300"
                      : norm.level === "D"
                      ? "text-orange-400"
                      : "text-red-400"
                  }
                >
                  {norm.level}
                </b>
              </p>

              <button
                onClick={() =>
                  onSelect(
                    p.metrics,
                    p.name,
                    p.nivelActual
                  )
                }
                className="mt-4 w-full bg-sky-600 hover:bg-sky-500 text-xs px-3 py-2 rounded-lg"
              >
                Usar estas métricas
              </button>
            </div>
          );
        })}
      </div>
    </main>
  </div>
);

// ------------------------------
//       PANEL ADMIN
// ------------------------------
const AdminScreen = ({ onBack }) => (
  <div className="min-h-screen bg-slate-950 text-slate-50">
    <header className="border-b border-slate-800 bg-slate-900 p-4 flex justify-between">
      <button
        onClick={onBack}
        className="px-3 py-2 bg-slate-700 rounded-lg text-xs"
      >
        ← Volver
      </button>
      <h1 className="text-lg font-bold text-sky-300">
        Panel Admin · Modelo IA
      </h1>
    </header>

    <main className="max-w-5xl mx-auto p-6 space-y-6">
      {/* TARJETA 1 — Pipeline IA simulado */}
      <Card
        title="Pipeline del modelo"
        subtitle="Simulación del notebook original"
      >
        <ol className="list-decimal text-xs text-slate-300 pl-4 space-y-1">
          <li>Carga de métricas</li>
          <li>Normalización avanzada</li>
          <li>Entrenamiento con XGBoost</li>
          <li>Cálculo de importancia de variables</li>
          <li>Generación del predictor final</li>
        </ol>
      </Card>

      {/* TARJETA 2 — Vista estilo Colab */}
      <Card
        title="Notebook · Vista tipo Google Colab"
        subtitle="Simulación visual"
      >
        <div className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 space-y-4">
          {/* CELDA 1 */}
          <div className="bg-slate-800 rounded-md p-3">
            <p className="text-[11px] text-slate-400 mb-2">
              # Cargar dataset de métricas
            </p>
            <pre className="text-[11px] text-slate-200 overflow-x-auto">
{`import pandas as pd
df = pd.read_csv("metrics.csv")
df.head()`}
            </pre>
          </div>

          <div className="bg-black/40 p-3 rounded-md text-[11px] text-green-300">
            ✔ Dataset cargado correctamente (216 filas, 18 columnas)
          </div>

          {/* CELDA 2 */}
          <div className="bg-slate-800 rounded-md p-3">
            <p className="text-[11px] text-slate-400 mb-2">
              # Entrenar modelo
            </p>
            <pre className="text-[11px] text-slate-200 overflow-x-auto">
{`from xgboost import XGBRegressor
model = XGBRegressor(n_estimators=300, learning_rate=0.05)
model.fit(X_train, y_train)`}
            </pre>
          </div>

          <div className="bg-black/40 p-3 rounded-md text-[11px] text-yellow-300">
            ⏳ Entrenando modelo… (simulado)
          </div>

          {/* CELDA 3 */}
          <div className="bg-slate-800 rounded-md p-3">
            <p className="text-[11px] text-slate-400 mb-2">
              # Guardar modelo
            </p>
            <pre className="text-[11px] text-slate-200 overflow-x-auto">
{`import joblib
joblib.dump(model, "model.pkl")`}
            </pre>
          </div>
        </div>

        {/* Botón abrir en Colab */}
        <button
          onClick={() =>
            window.open(
              "https://colab.research.google.com/",
              "_blank"
            )
          }
          className="mt-4 px-3 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 rounded-lg"
        >
          Abrir en Google Colab
        </button>
      </Card>

      {/* TARJETA 3 — Monitoreo */}
      <Card title="Monitoreo del modelo">
        <div className="grid grid-cols-4 gap-3">
          <Stat
            label="MAE"
            value="4.2"
            tone="green"
            helper="Error medio absoluto"
          />
          <Stat
            label="R²"
            value="0.87"
            tone="green"
            helper="Ajuste del modelo"
          />
          <Stat
            label="Inferencias"
            value="128"
            helper="Últimas 24h"
          />
          <Stat
            label="Deriva"
            value="Baja"
            tone="amber"
            helper="Datos estables"
          />
        </div>
      </Card>
    </main>
  </div>
);

// ------------------------------
//         APP PRINCIPAL
// ------------------------------
function App() {
  const [view, setView] = useState("main");
  const [metrics, setMetrics] = useState({
    code_smells: 0,
    open_issues: 0,
    lines: 0,
    security_hotspots: 0,
    cognitive_complexity: 0,
    coverage: 0,
    duplicated_lines: 0,
    DeudaTEcnicaHoras: 32,
    rate: HOURLY_RATE_DEFAULT,
  });

  const [selectedProjectName, setSelectedProjectName] =
    useState(null);
  const [nivelActualServicio, setNivelActualServicio] =
    useState("-");
  const [plan, setPlan] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (field, value) => {
    setMetrics((prev) => ({
      ...prev,
      [field]: Number(value) || 0,
    }));
  };

  const hasMetrics =
    metrics.code_smells > 0 ||
    metrics.open_issues > 0 ||
    metrics.lines > 0;

  // Conectar con Sonar
  const handleOpenSonarScreen = () => {
    setIsRunning(true);
    setStatusMessage("Iniciando conexión con servidor Sonar…");

    setTimeout(
      () => setStatusMessage("Validando credenciales…"),
      1000
    );
    setTimeout(
      () => setStatusMessage("Cargando servicios…"),
      2000
    );
    setTimeout(() => {
      setIsRunning(false);
      setStatusMessage("");
      setView("sonar");
    }, 3000);
  };

  // 🔹 NUEVO: abrir Panel Admin con simulación de carga
  const handleOpenAdmin = () => {
    setIsRunning(true);
    setStatusMessage("Cargando notebook…");

    setTimeout(
      () => setStatusMessage("Montando kernel Python…"),
      1200
    );
    setTimeout(
      () =>
        setStatusMessage(
          "Inicializando modelo XGBoost…"
        ),
      2200
    );
    setTimeout(
      () => setStatusMessage("Preparando entorno Colab…"),
      3200
    );

    setTimeout(() => {
      setIsRunning(false);
      setStatusMessage("");
      setView("admin");
    }, 4200);
  };

  // Ejecutar Estimación IA
  const handleRunAnalysis = () => {
    if (!hasMetrics) return;

    setPlan(null);
    setIsRunning(true);

    setStatusMessage(
      "Preparando entorno de análisis…"
    );
    setTimeout(
      () => setStatusMessage("Analizando métricas…"),
      1000
    );
    setTimeout(
      () =>
        setStatusMessage(
          "Normalizando características…"
        ),
      1800
    );
    setTimeout(
      () =>
        setStatusMessage(
          "Midiendo complejidad y riesgo…"
        ),
      2600
    );
    setTimeout(
      () =>
        setStatusMessage("Ejecutando modelo XGBoost…"),
      3400
    );
    setTimeout(
      () =>
        setStatusMessage("Generando estimación…"),
      4200
    );

    setTimeout(() => {
      const result = estimatePlanFromMetrics(metrics);
      setPlan(result);
      setIsRunning(false);
      setStatusMessage("Análisis completado.");
    }, 4800);
  };

  // Seleccionar servicio Sonar
  const handleSelectFromSonar = (m, name, nivelA) => {
    setMetrics(m);
    setSelectedProjectName(name);
    setNivelActualServicio(nivelA);
    setPlan(null);
    setView("main");
  };

  // ------------------------------
  //         RENDER PRINCIPAL
  // ------------------------------
  if (view === "sonar")
    return (
      <SonarScreen
        onBack={() => setView("main")}
        onSelect={handleSelectFromSonar}
      />
    );

  if (view === "admin")
    return <AdminScreen onBack={() => setView("main")} />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900 py-3 no-print">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" />
            <div>
              <h1 className="text-xl text-sky-300 font-bold">
                PROMECIA · IA
              </h1>
              <p className="text-[11px] text-slate-400">
                Estimación de esfuerzo según calidad de código
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdmin}
            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs"
          >
            Panel admin
          </button>
        </div>
      </header>

      {isRunning && (
        <div className="bg-slate-900 text-sky-300 text-center py-2 text-xs border-b border-slate-800">
          {statusMessage}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-6 space-y-6 print-area">
        {/* BLOQUE 1 — MÉTRICAS */}
        <Card
          title="1. Métricas de análisis"
          subtitle={
            selectedProjectName
              ? `Origen: ${selectedProjectName} (Sonar simulado)`
              : "Ingresalas manualmente o conectate a Sonar"
          }
        >
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              ["code_smells", "Code Smells"],
              ["open_issues", "Issues Abiertos"],
              ["lines", "Líneas de Código"],
              ["security_hotspots", "Hotspots Seguridad"],
              ["cognitive_complexity", "Complejidad Cognitiva"],
              ["coverage", "Coverage (%)"],
              ["duplicated_lines", "Líneas Duplicadas"],
              ["DeudaTEcnicaHoras", "Deuda Técnica (horas)"],
            ].map(([field, label]) => (
              <div key={field} className="flex flex-col">
                <label className="text-[11px] text-slate-400">
                  {label}
                </label>
                <input
                  type="number"
                  value={metrics[field]}
                  onChange={(e) =>
                    handleChange(field, e.target.value)
                  }
                  className="bg-slate-800 border border-slate-700 px-2 py-1 rounded-md"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isRunning}
            className="w-full mt-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs"
          >
            {isRunning
              ? "Procesando…"
              : "Validar estimación con IA"}
          </button>
        </Card>

        {/* BLOQUE 2 — ESTIMACIÓN IA */}
        <Card
          title="2. Estimación IA"
          subtitle="Esfuerzo y reducción de riesgo"
        >
          {!plan ? (
            <p className="text-xs text-slate-400">
              Ingresá métricas y validá con IA…
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Stat
                  label="Horas estimadas"
                  value={plan.horasTotales}
                  tone="blue"
                />
                <Stat
                  label="Costo estimado"
                  value={`$ ${plan.costo.toLocaleString(
                    "es-CO"
                  )}`}
                  helper={`Tarifa: $${HOURLY_RATE_DEFAULT.toLocaleString(
                    "es-CO"
                  )}/h`}
                />
              </div>

              <hr className="border-slate-800 my-3" />

              <div className="grid grid-cols-2 gap-3">
                <Stat
                  label="Nivel actual"
                  value={nivelActualServicio}
                  helper="Según Sonar"
                  tone="amber"
                />
                <Stat
                  label="Nivel proyectado"
                  value={plan.nivelProyectado}
                  helper="Post-mejoras"
                  tone="green"
                />
              </div>

              <p className="text-xs text-slate-400 mt-3">
                El modelo predice una reducción de riesgo del{" "}
                <b>
                  {(
                    100 -
                    (plan.riesgoProyectado /
                      plan.riskScore) *
                      100
                  ).toFixed(1)}
                  %
                </b>{" "}
                mejorando el servicio de{" "}
                <b>{nivelActualServicio}</b> →{" "}
                <b>{plan.nivelProyectado}</b>.
              </p>
            </>
          )}
        </Card>

        {/* BLOQUE 3 — PLAN DE MEJORA */}
        {plan && (
          <Card title="3. Plan de mejora automática">
            <div className="grid grid-cols-2 gap-3">
              <Stat
                label="Refactor"
                value={`${plan.horasRefactor} h`}
              />
              <Stat
                label="Pruebas"
                value={`${plan.horasPruebas} h`}
              />
              <Stat
                label="Seguridad"
                value={`${plan.horasSeguridad} h`}
              />
              <Stat
                label="Gestión"
                value={`${plan.horasGestion} h`}
              />
            </div>

            {/* RADAR CHART */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-100 mb-2">
                Perfil de calidad (Radar Chart)
              </h3>
              <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl h-[320px]">
                <Radar
                  data={getRadarData(metrics)}
                  options={radarOptions}
                />
              </div>
            </div>

            {/* RECOMENDACIONES PERSONALIZADAS */}
            <h3 className="text-sm font-semibold text-slate-100 mt-4">
              Recomendaciones personalizadas
            </h3>
            <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1 mt-2">
              {plan.riskScore > 220 && (
                <li>
                  El servicio presenta riesgo crítico. Priorizar
                  refactor en módulos grandes.
                </li>
              )}
              {plan.coverageGap > 10 && (
                <li>
                  Aumentar cobertura al 80% para reducir fallos en
                  producción.
                </li>
              )}
              {plan.duplicatedPct > 8 && (
                <li>
                  Reducir duplicación aplicando principios DRY.
                </li>
              )}
              {plan.complexity > 140 && (
                <li>
                  Dividir funciones extensas para reducir
                  complejidad.
                </li>
              )}
              {plan.hotspotsDensity > 0.3 && (
                <li>
                  Atender hotspots de seguridad de forma
                  inmediata.
                </li>
              )}
              {plan.riskScore < 120 && (
                <li>
                  Métricas saludables. Mantener estrategia actual.
                </li>
              )}
            </ul>

            {/* RECOMENDACIONES GENERALES */}
            <h3 className="text-sm font-semibold text-slate-100 mt-4">
              Recomendaciones generales
            </h3>
            <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1 mt-2">
              <li>
                Implementar análisis automático en el pipeline
                CI/CD.
              </li>
              <li>
                Revisar métricas semanalmente con arquitectura.
              </li>
              <li>
                Aplicar pruebas automatizadas para evitar
                regresiones.
              </li>
              <li>
                Establecer políticas de codificación consistentes.
              </li>
              <li>
                Realizar revisiones técnicas periódicas.
              </li>
            </ul>
          </Card>
        )}

        {/* BOTONES */}
        <div className="flex gap-3 no-print">
          <button
            onClick={handleOpenSonarScreen}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs"
          >
            Conectarme con servidor Sonar
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs"
          >
            Exportar PDF
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;