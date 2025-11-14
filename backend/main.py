from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from prophet import Prophet
import json
from datetime import datetime

app = FastAPI()

# --- CORS setup ---
origins = [
    "http://localhost:3000",  # your React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Forecast endpoint ---
@app.get("/forecast/")
def get_forecast():
    # load your CSV
    df = pd.read_csv("ml/climate_disease_dataset.csv")

    # Automatically handle any disease column / region
    region = "Central"
    disease_col = "dengue_cases"

    # make datetime
    df['ds'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'].astype(str) + '-01')
    df['y'] = df[disease_col]

    # filter region
    reg_df = df[df['region'] == region][['ds', 'y']].sort_values('ds')

    # fill missing values gracefully
    reg_df = reg_df.fillna(0)

    # train Prophet
    model = Prophet(daily_seasonality=False)
    model.fit(reg_df)

    # predict next 7 periods
    future = model.make_future_dataframe(periods=7)
    forecast = model.predict(future)

    # prepare JSON
    out = []
    for _, r in forecast[['ds','yhat','yhat_lower','yhat_upper']].tail(10).iterrows():
        out.append({
            "date": r['ds'].strftime("%Y-%m-%d"),
            "yhat": float(r['yhat']),
            "yhat_lower": float(r['yhat_lower']),
            "yhat_upper": float(r['yhat_upper'])
        })

    payload = {
        "region": region,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "forecast": out
    }

    return payload

@app.get("/")
def root():
    return {"status": "API running"}
