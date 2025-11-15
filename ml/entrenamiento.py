# === ENTRENAMIENTO Y COMPARATIVA EN EL 90% (CV 5-FOLD) — SIN REDONDEAR ===
import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.metrics import make_scorer, accuracy_score, precision_score, recall_score, f1_score

# Modelos
from sklearn.ensemble import HistGradientBoostingClassifier, RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier

from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

# 1) Cargar dataset (detección de separador)
def leer_csv_seguro(path):
    df = pd.read_csv(path, sep=None, engine="python")
    df.columns = [c.strip() for c in df.columns]
    if len(df.columns) == 1:
        df = pd.read_csv(path, sep=";", engine="python")
        df.columns = [c.strip() for c in df.columns]
    return df

CSV_PATH = "anemia_clean.csv"
if not os.path.exists(CSV_PATH):
    raise FileNotFoundError("No se encontró 'anemia_clean.csv' en la carpeta actual.")

df = leer_csv_seguro(CSV_PATH)
print(f"✅ Dataset cargado con {len(df)} filas")
print("Columnas:", list(df.columns))

# Validar columnas esperadas
esperadas = {"Gender", "Hemoglobin", "MCH", "MCHC", "MCV", "Result"}
faltan = esperadas - set(df.columns)
if faltan:
    raise ValueError(f"Faltan columnas en el CSV: {faltan}")

# 2) Preparar X, y (Result -> 0/1 si viniera en texto)
X = df[["Gender", "Hemoglobin", "MCH", "MCHC", "MCV"]].copy()
y_raw = df["Result"].copy()

# Si y ya es numérica (0/1), úsala directo; si es texto, mapear
if pd.api.types.is_numeric_dtype(y_raw):
    y = y_raw.astype(int)
else:
    # Ajusta/añade valores si tu CSV usa otros textos
    POS = {"1", "si", "sí", "yes", "positivo", "positive",
           "anemia", "anémico", "mild", "moderate", "severe"}
    NEG = {"0", "no", "negativo", "negative", "normal", "no anemia", "non-anemia", "non anemia"}

    def norm(s):
        s = str(s).strip().lower()
        s = s.replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u")
        return s

    y = y_raw.map(lambda v: 1 if norm(v) in POS else (0 if norm(v) in NEG else np.nan))
    if y.isna().any():
        unicos = sorted(set(map(lambda v: str(v), y_raw.unique())))
        raise ValueError(f"Hay valores en Result que no mapeé a 0/1. Revisa y dime cómo mapearlos:\n{unicos}")

print("Distribución de y:", y.value_counts().to_dict())

# 3) Split estratificado 90%/10% (guardamos el 10% para después, sin evaluarlo ahora)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.10, random_state=42, stratify=y
)
print(f"📦 Split 90/10 -> train: {X_train.shape[0]}  |  test (hold-out): {X_test.shape[0]}")

# Guardar particiones (útil para la etapa del 10% luego)
train_out = X_train.copy(); train_out["Result"] = y_train.values
test_out  = X_test.copy();  test_out["Result"]  = y_test.values
train_out.to_csv("anemia_train_90.csv", index=False)
test_out.to_csv("anemia_test_10_holdout.csv", index=False)
print("💾 Guardados anemia_train_90.csv y anemia_test_10_holdout.csv")

# 4) Modelos (6)
modelos = {
    "HistGradientBoosting": HistGradientBoostingClassifier(random_state=42),
    "RandomForest": RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1),
    "DecisionTree": DecisionTreeClassifier(random_state=42),
    "LogisticRegression": make_pipeline(StandardScaler(), LogisticRegression(max_iter=500, random_state=42)),
    "SVC_RBF": make_pipeline(StandardScaler(), SVC(kernel="rbf", C=1.0, gamma="scale", probability=True, random_state=42)),
    "KNN": make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5, weights="distance")),
}

# 5) Validación cruzada 5-fold SOLO sobre el 90% (sin redondear)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scoring = {
    "acc":  make_scorer(accuracy_score),
    "prec": make_scorer(precision_score),
    "rec":  make_scorer(recall_score),
    "f1":   make_scorer(f1_score),
}

print("\n=== 🔍 Validación cruzada (5-fold) sobre el 90% (train) ===\n")
resultados = []
for nombre, modelo in modelos.items():
    res = cross_validate(modelo, X_train, y_train, cv=cv, scoring=scoring, return_train_score=False)
    # SIN REDONDEAR: usar repr(float(...)) para imprimir toda la precisión disponible
    print(f"Modelo: {nombre}")
    print("  Accuracy (mean):  ", repr(float(res['test_acc'].mean())))
    print("  Precision (mean): ", repr(float(res['test_prec'].mean())))
    print("  Recall (mean):    ", repr(float(res['test_rec'].mean())))
    print("  F1-Score (mean):  ", repr(float(res['test_f1'].mean())), "\n")

    resultados.append({
        "Modelo": nombre,
        "Accuracy": res['test_acc'].mean(),
        "Precision": res['test_prec'].mean(),
        "Recall": res['test_rec'].mean(),
        "F1-Score": res['test_f1'].mean(),
    })

# 6) Tabla comparativa del 90% y guardado
tabla = pd.DataFrame(resultados)
print("📊 Resultados comparativos (CV en el 90% — sin redondear al imprimir):\n")
print(tabla)

tabla.to_csv("resultados_modelos_cv_train90.csv", index=False)
print("💾 Guardado 'resultados_modelos_cv_train90.csv'")

# 7) Entrenar modelos finales con TODO el 90% y guardarlos
for nombre, modelo in modelos.items():
    modelo.fit(X_train, y_train)
    joblib.dump(modelo, f"modelo_{nombre.lower()}_train90.pkl")
print("💾 Modelos guardados (*.pkl) entrenados con el 90% de datos.")

print("\n✅ Listo. El 10% quedó reservado para evaluarlo luego cuando me digas.")