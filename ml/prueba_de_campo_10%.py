# === GRAFICOS DE PRUEBA DE CAMPO — RANDOM FOREST (10% HOLD-OUT) ===
import os
import joblib
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, roc_curve, auc

import seaborn as sns

# Directorios
DATA_DIR = "data"
MODELS_DIR = "Modelos"
PLOTS_DIR = "Graficos"
os.makedirs(PLOTS_DIR, exist_ok=True)

# ============================
# Cargar modelo Random Forest
# ============================
model_path = os.path.join(MODELS_DIR, "modelo_randomforest_train90.pkl")
modelo = joblib.load(model_path)

# ============================
# Cargar dataset TEST 10%
# ============================
df_test = pd.read_csv(os.path.join(DATA_DIR, "anemia_test_10_holdout.csv"))
X_test = df_test.drop(columns=["Result"])
y_test = df_test["Result"].astype(int)

# ============================
# Predicciones en el 10%
# ============================
y_pred = modelo.predict(X_test)
y_prob = modelo.predict_proba(X_test)[:, 1]

# ============================
# 1️⃣ Matriz de Confusión
# ============================
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=["No anemia", "Anemia"],
            yticklabels=["No anemia", "Anemia"])
plt.title("Matriz de Confusión — Random Forest (Test 10%)", fontsize=14)
plt.xlabel("Predicción")
plt.ylabel("Real")
plt.tight_layout()

cm_path = os.path.join(PLOTS_DIR, "rf_matriz_confusion_test10.png")
plt.savefig(cm_path, dpi=250)
plt.close()
print("📊 Matriz de Confusión guardada:", cm_path)

# ============================
# 2️⃣ Curva ROC-AUC
# ============================
fpr, tpr, _ = roc_curve(y_test, y_prob)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(7,6))
plt.plot(fpr, tpr, label=f"AUC = {roc_auc}", linewidth=2)
plt.plot([0,1], [0,1], linestyle="--", color="gray")
plt.title("Curva ROC — Random Forest (Test 10%)", fontsize=14)
plt.xlabel("Tasa de Falsos Positivos")
plt.ylabel("Tasa de Verdaderos Positivos")
plt.legend()
plt.grid(alpha=0.3)
plt.tight_layout()

roc_path = os.path.join(PLOTS_DIR, "rf_curva_roc_test10.png")
plt.savefig(roc_path, dpi=250)
plt.close()
print("📈 Curva ROC guardada:", roc_path)

print("\n✅ Gráficos de prueba de campo generados con éxito.\n")
