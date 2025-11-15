from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Literal
from pathlib import Path
import os
import logging
import joblib
import numpy as np


# =========================
# Cargar .env
# =========================
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")


# =========================
# FastAPI App
# =========================
app = FastAPI(title="API Anemia IA")
api_router = APIRouter(prefix="/api")


# =========================
# Cargar Modelo Entrenado
# =========================
MODEL_PATH = ROOT_DIR.parent / "ml" / "Modelos" / "modelo_randomforest_train90.pkl"

try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Modelo cargado: {MODEL_PATH}")
except Exception as e:
    raise RuntimeError(f"❌ ERROR cargando el modelo en: {MODEL_PATH}\n{e}")


# =========================
# Modelos Pydantic
# =========================
class AnemiaAnalysisInput(BaseModel):
    genero: Literal["masculino", "femenino"]
    hemoglobina: float
    mch: float
    mchc: float
    mcv: float

class AnemiaResult(BaseModel):
    tiene_anemia: bool
    nivel_severidad: str
    prob_anemia: float
    mensaje: str
    recomendaciones: List[str]
    valores_ingresados: dict


# =========================
# Funciones Lógicas
# =========================
def procesar_genero(g: str) -> int:
    return 1 if g.lower() == "masculino" else 0


def severidad_hb(genero: str, hb: float) -> str:
    # WHO simplified
    if genero == "masculino":
        if hb >= 13: return "sin_anemia"
        if hb >= 11: return "leve"
        if hb >= 8: return "moderada"
        return "severa"
    else:
        if hb >= 12: return "sin_anemia"
        if hb >= 11: return "leve"
        if hb >= 8: return "moderada"
        return "severa"


def recomendaciones_por_severidad(s: str):
    base = [
        "Mantén una dieta rica en hierro (carnes rojas, espinaca, lentejas).",
        "Consume vitamina C para absorber hierro (naranja, kiwi).",
        "Evita té/café junto a comidas con hierro."
    ]
    if s == "leve": 
        return base + ["Control médico recomendado."]
    if s == "moderada":
        return base + ["Consulta con un profesional de salud cuanto antes."]
    if s == "severa":
        return base + ["Acude a un centro médico urgentemente."]
    return ["Niveles saludables. Mantén una buena alimentación."]


# =========================
# Rutas
# =========================
@api_router.get("/")
async def root():
    return {"message": "Sistema de anemia funcionando ✅"}


@api_router.post("/analizar-anemia", response_model=AnemiaResult)
async def analizar_anemia(datos: AnemiaAnalysisInput):

    genero_num = procesar_genero(datos.genero)

    # INPUT AL MODELO — el mismo ORDEN del entrenamiento
    arr = np.array([[genero_num, datos.hemoglobina, datos.mch, datos.mchc, datos.mcv]])

    try:
        pred = int(model.predict(arr)[0])  # 0 = sin anemia, 1 = con anemia
        prob = float(model.predict_proba(arr)[0][1])
    except Exception as e:
        raise RuntimeError(f"Error al predecir: {e}")

    tiene = pred == 1
    severidad = severidad_hb(datos.genero, datos.hemoglobina)

    mensaje = (
        "El modelo sugiere presencia de anemia." if tiene
        else "No hay indicios de anemia según el modelo."
    )

    recs = recomendaciones_por_severidad(severidad)

    return AnemiaResult(
        tiene_anemia=tiene,
        nivel_severidad=severidad,
        prob_anemia=round(prob, 4),
        mensaje=mensaje,
        recomendaciones=recs,
        valores_ingresados=datos.dict()
    )


# =========================
# Registrar Router
# =========================
app.include_router(api_router)


# =========================
# CORS
# =========================
def parse_origins(raw: str) -> List[str]:
    if not raw:
        return ["*"]
    items = [x.strip() for x in raw.split(",") if x.strip()]
    return items or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=parse_origins(os.environ.get("CORS_ORIGINS", "http://localhost:5173")),
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Logging
# =========================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# =========================
# Shutdown (por si usas DB luego)
# =========================
@app.on_event("shutdown")
async def shutdown():
    print("🔻 Cerrando backend…")
