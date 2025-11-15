# === GRAFICO FINAL PRINCIPAL: F1 (CV en 90%) ===
import os
import pandas as pd
import matplotlib.pyplot as plt

RESULTS_DIR = "resultados"
PLOTS_DIR = "Graficos"
os.makedirs(PLOTS_DIR, exist_ok=True)

csv_path = os.path.join(RESULTS_DIR, "resultados_modelos_cv_train90_auc.csv")
if not os.path.exists(csv_path):
    raise FileNotFoundError(f"No encuentro {csv_path}. Ejecuta primero el script que genera ese CSV.")

# Cargar resultados (sin redondeo)
tabla = pd.read_csv(csv_path)

# Ordenar por F1 (ascendente para que el mejor quede arriba al final)
orden = tabla.sort_values(by="F1", ascending=True)
modelos = orden["Modelo"].tolist()
valores = orden["F1"].tolist()

plt.figure(figsize=(12, 6))

# Paleta con colores diferentes por barra
palette = list(plt.cm.tab20.colors)
colors = [palette[i % len(palette)] for i in range(len(valores))]

bars = plt.barh(modelos, valores, color=colors)

plt.title("Comparativo F1 — CV en Train 90% (5-fold)", fontsize=14)
plt.xlabel("F1", fontsize=12)
plt.ylabel("Modelo", fontsize=12)
plt.grid(axis="x", linestyle="--", alpha=0.35)

# Etiquetas exactas (sin redondeo) dentro de cada barra
for bar, v in zip(bars, valores):
    x = bar.get_width()
    y = bar.get_y() + bar.get_height()/2
    plt.text(x - (0.01 if x <= 1 else x*0.02), y, repr(float(v)), va="center", ha="right", fontsize=9)

# Margen para que no se corten las etiquetas
xmax = max(valores) if valores else 1.0
plt.xlim(0, xmax + 0.02)

plt.tight_layout()
out_png = os.path.join(PLOTS_DIR, "cv90_f1.png")
plt.savefig(out_png, dpi=250)
plt.close()
print("Gráfico guardado en:", out_png)
