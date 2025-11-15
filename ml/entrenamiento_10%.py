# === EVALUACIÓN FINAL DEL 10% HOLD-OUT — SIN REDONDEAR ===
import os
import pandas as pd
import matplotlib.pyplot as plt
import joblib

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# RUTAS
DATA_DIR = "data"
MODELS_DIR = "Modelos"
RESULTS_DIR = "resultados"
PLOTS_DIR = "Graficos"

os.makedirs(RESULTS_DIR, exist_ok=True)
os.makedirs(PLOTS_DIR, exist_ok=True)

# ARCHIVOS
TEST_PATH = os.path.join(DATA_DIR, "anemia_test_10_holdout.csv")

# Cargar datos del TEST (10%)
test_df = pd.read_csv(TEST_PATH)
X_test = test_df.drop(columns=["Result"])
y_test = test_df["Result"].astype(int)

# Lista de modelos
model_files = {
    "HistGradientBoosting": "modelo_histgradientboosting_train90.pkl",
    "RandomForest": "modelo_randomforest_train90.pkl",
    "DecisionTree": "modelo_decisiontree_train90.pkl",
    "LogisticRegression": "modelo_logisticregression_train90.pkl",
    "SVC_RBF": "modelo_svc_rbf_train90.pkl",
    "KNN": "modelo_knn_train90.pkl",
}

resultados = []

print("\n=== 🔍 Evaluación FINAL en el 10% HOLD-OUT ===\n")

for nombre, filename in model_files.items():
    model_path = os.path.join(MODELS_DIR, filename)
    if not os.path.exists(model_path):
        print(f"⚠️ No encontré: {model_path}")
        continue

    modelo = joblib.load(model_path)

    y_pred = modelo.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    pre = precision_score(y_test, y_pred, zero_division=0)
    rec = recall_score(y_test, y_pred, zero_division=0)
    f1  = f1_score(y_test, y_pred, zero_division=0)

    resultados.append({
        "Modelo": nombre,
        "Accuracy": acc,
        "Precision": pre,
        "Recall": rec,
        "F1": f1,
    })

# Convertir resultados a DataFrame
resultados_df = pd.DataFrame(resultados)

# Mostrar TABLA comparativa SIN redondear
print("\n📊 === TABLA COMPARATIVA TEST 10% (SIN REDONDEAR) ===")
print(resultados_df.to_string(index=False))

# Guardar CSV
out_csv = os.path.join(RESULTS_DIR, "resultados_modelos_test10.csv")
resultados_df.to_csv(out_csv, index=False)
print("\n📄 Resultados guardados en:", out_csv)

# === Gráfico F1 en el 10% ===
orden = resultados_df.sort_values(by="F1", ascending=True)
modelos = orden["Modelo"].tolist()
valores = orden["F1"].tolist()

plt.figure(figsize=(12, 6))
palette = list(plt.cm.tab20.colors)
colors = [palette[i % len(palette)] for i in range(len(valores))]
bars = plt.barh(modelos, valores, color=colors)

plt.title("Comparativo F1 — Test REAL 10%", fontsize=14)
plt.xlabel("F1", fontsize=12)
plt.ylabel("Modelo", fontsize=12)
plt.grid(axis="x", linestyle="--", alpha=0.35)

for bar, v in zip(bars, valores):
    x = bar.get_width()
    y = bar.get_y() + bar.get_height()/2
    plt.text(x - 0.01, y, repr(float(v)), va="center", ha="right", fontsize=9)

plt.tight_layout()
out_png = os.path.join(PLOTS_DIR, "test10_f1.png")
plt.savefig(out_png, dpi=250)
plt.close()
print("\n📊 Gráfico guardado en:", out_png)

print("\n✅ Evaluación COMPLETA del 10% terminada.\n")
