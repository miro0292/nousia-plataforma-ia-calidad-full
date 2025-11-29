🦉 PROMECIA · Procesamiento de Métricas de Calidad de Software con IA  
**NousIA · Plataforma de Análisis Predictivo de Calidad**

PROMECIA es una plataforma interactiva que permite **analizar métricas de calidad de código**, **estimar el esfuerzo técnico necesario para realizar mejoras**, y **proyectar el impacto en el nivel de calidad** utilizando técnicas de **Inteligencia Artificial**.

Este proyecto incluye:

- Un ** funcional** desarrollado en React.  
- Simulación de conexión a **SonarQube**.  
- Motor de estimación basado en el modelo original construido en **Python + IA** (notebook desarrollado por tu equipo).  
- Generación de **reporte PDF** con indicadores clave.  
- Panel administrativo con métricas simuladas del modelo.

---

## 🚀 Características principales

✔ **Simulación de conexión a SonarQube**  
✔ Visualización de **9 servicios** con métricas reales (code smells, issues, duplicación, hotspots, complejidad, etc.)  
✔ Estimación automática del esfuerzo:  
   - Horas totales  
   - Refactor  
   - Pruebas  
   - Seguridad  
   - Gestión  
✔ **Radar Chart** con perfil del servicio  
✔ **Niveles de calidad A–E** antes/después  
✔ **Costo estimado en COP**, basado en tarifa de 92.000 COP/h  
✔ Recomendaciones personalizadas según riesgo  
✔ Exportación a PDF  
✔ Simulación de modelo XGBoost (flujo del notebook)  
✔ Panel Admin para monitoreo

---

## 🧠 Flujo general de la solución

1. **Carga o adquisición de métricas** (manual o vía Sonar simulado)  
2. **Normalización de métricas** (densidad, duplicación, coverage gap, hotspots por KLOC, etc.)  
3. **Cálculo del puntaje de riesgo**  
4. **Proyección del nivel de calidad** mediante función de mapeo A–E  
5. **Estimación del esfuerzo** según:  
   - Complejidad  
   - Duplicación  
   - Hotspots  
   - Deuda técnica  
   - Métricas estructurales  
6. **Generación de plan de mejora automático**  
7. **Visualización + Exportación PDF**

---

## 🏗 Arquitectura del proyecto

```
┌──────────────────────────┐
│    Interfaz React (UI)   │
└───────────────┬──────────┘
                │
        Métricas del usuario
                │
┌───────────────▼──────────┐
│  Módulo IA (simulación)  │
│ - Normalización          │
│ - Riesgo                 │
│ - Esfuerzo               │
│ - Nivel proyectado       │
└───────────────┬──────────┘
                │
          Resultados UI
                │
┌───────────────▼──────────┐
│ PDF Generator (print API)│
└──────────────────────────┘
```

---

## 🛠 Tecnologías utilizadas

### **Frontend**
- React + Vite  
- TailwindCSS  
- Chart.js (Radar)  
- React-ChartJS-2  

### **Simulación de IA**
- Normalización y cálculos desarrollados en JS  
- Basado en modelo original entrenado en Python (XGBoost)

### **Diseño**
- Estilo Dark “NousIA” · slate + sky  
- Logotipo en PNG incluido

---

## 📦 Instalación y ejecución

### 1. Clonar repositorio
```bash
git clone https://github.com/tu-usuario/nousia-promecia.git
cd nousia-promecia
```

### 2. Instalar dependencias
Asegúrate de tener instalado **Node.js ≥ 18**.

```bash
npm install
```

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 4. Construir versión producción
```bash
npm run build
```

---

## 📸 Capturas de pantalla

> *Reemplazá las imágenes cuando las tengas listas.*

### 🔹 Pantalla principal  
![pantalla-principal](docs/img/main.png)

### 🔹 Simulación Sonar  
![sonar-screen](docs/img/sonar.png)

### 🔹 Radar Chart  
![radar-chart](docs/img/radar.png)

### 🔹 Panel Admin  
![admin-screen](docs/img/admin.png)

---

## 📁 Estructura del proyecto

```
src/
│
├── App.jsx
├── index.jsx
├── index.css
├── components/      (opcional)
│
public/
│   └── logo.png
```

---

## 📊 Modelo IA (resumen técnico)

El modelo original del proyecto se desarrolló en Python:

- Preprocesamiento con métricas de Sonar  
- Normalización avanzada  
- Entrenamiento con **XGBoost Regressor**  
- Evaluación:  
  - R² ≈ 0.91  
  - MAE ≈ 52.8 horas  
- Selección de variables importantes:  
  - `lines`, `open_issues`, `cognitive_complexity`, `security_hotspots`, `duplicated_lines`

El React **simula el comportamiento del modelo real**, siguiendo estrictamente la lógica del notebook.

---

## 📡 Conexión Sonar (modo )

La plataforma incluye:

- Delay de conexión (3 segundos)
- Carga de 9 servicios con diversas métricas
- Niveles actuales A–E
- Riesgo normalizado por KLOC

Esto permite presentar el flujo completo sin depender de un servidor real.

---

## 🧩 Roadmap

### ✔ Versión actual
- UI estable  
- Modelo simulado  
- PDF funcional  
- Panel Admin  

### 🟦 Próximas mejoras
- API backend real  
- Integración SonarQube REST API  
- Autenticación JWT  
- Múltiples usuarios  
- Historial de estimaciones  
- Dashboard analítico avanzado  

---

## 👤 Autor

**Miguel Rojas González**  
**Andrés Sarmiento** 
**Jaime Andrés Leal** 
**José Balaguera Ricardo** 
**Juan Manuel Cortés** 
Fundador & Arquitecto IA — *NousIA*  

---

## 🦉 Créditos

Logo, diseño y concepto creados por **NousIA**.  
Código y estructura optimizados con apoyo de ChatGPT.  

---

## 📄 Licencia

Este proyecto se distribuye bajo licencia **MIT**.