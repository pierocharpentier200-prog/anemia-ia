# === GRAFICOS CLINICOS RANDOM FOREST (90%) ===
import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestClassifier

# Directorios
DATA_DIR = "data"
MODELS_DIR = "Modelos"
PLOTS_DIR = "Graficos"

os.makedirs(PLOTS_DIR, exist_ok=True)

# Cargar dataset 90%
df_train = pd.read_csv(os.path.join(DATA_DIR, "anemia_train_90.csv"))

X_train = df_train.drop(columns=["Result"])
y_train = df_train["Result"].astype(int)

# Cargar modelo Random Forest entrenado con el 90%
model_path = os.path.join(MODELS_DIR, "modelo_randomforest_train90.pkl")
modelo = joblib.load(model_path)

# Asegurar que es un Random Forest y obtener importancia
if hasattr(modelo, "feature_importances_"):
    importancias = modelo.feature_importances_
else:
    raise TypeError("El modelo cargado no es RandomForest o no tiene feature_importances_")

features = X_train.columns.tolist()

# === 1️⃣ Gráfico de Importancia de Características ===
orden = sorted(zip(importancias, features), reverse=True)
vals, labels = zip(*orden)

plt.figure(figsize=(10,6))
bars = plt.barh(labels, vals, color=plt.cm.tab20.colors)
plt.title("Importancia de Características — Random Forest (90%)", fontsize=14)
plt.xlabel("Importancia")
plt.grid(axis="x", linestyle="--", alpha=0.35)
plt.gca().invert_yaxis()  # La más importante arriba
plt.tight_layout()

out1 = os.path.join(PLOTS_DIR, "rf_importancia_variables.png")
plt.savefig(out1, dpi=250)
plt.close()
print("📊 Gráfico guardado:", out1)

# === 2️⃣ Boxplot Hemoglobina vs Clase (clínico) ===
plt.figure(figsize=(8,6))
df_train.boxplot(column="Hemoglobin", by="Result", grid=False,
                 patch_artist=True,
                 boxprops=dict(facecolor="lightblue"),
                 medianprops=dict(color="red", linewidth=2))
plt.title("Distribución de Hemoglobina por Clase — 90% Entrenamiento")
plt.suptitle("")  # Quitar título duplicado
plt.xlabel("Clase (0 = No anemia, 1 = Anemia)")
plt.ylabel("Nivel de Hemoglobina")
plt.tight_layout()

out2 = os.path.join(PLOTS_DIR, "rf_boxplot_hemoglobina.png")
plt.savefig(out2, dpi=250)
plt.close()
print("📊 Gráfico guardado:", out2)

print("\n✅ Gráficos clínicos del Random Forest generados con éxito.\n")
