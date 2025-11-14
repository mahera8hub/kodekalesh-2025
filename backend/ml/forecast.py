# ml/forecast.py
import pandas as pd
from prophet import Prophet
import json
import hashlib
from datetime import datetime
import os

# Config
BUCKET = None  # if hackathon provides, else None
S3_KEY = "outbraik/forecast.json"

def generate_forecast(csv_file='climate_disease_dataset.csv'):
    df = pd.read_csv(csv_file)

    # Automatically detect columns
    date_col = 'date' if 'date' in df.columns else None
    if not date_col and 'year' in df.columns and 'month' in df.columns:
        df['date'] = pd.to_datetime(df['year'].astype(str) + '-' + df['month'].astype(str) + '-01')
        date_col = 'date'

    regions = df['region'].unique().tolist()
    disease_cols = [c for c in df.columns if c.endswith('_cases')]

    all_forecasts = {}

    for region in regions:
        all_forecasts[region] = {}
        for disease in disease_cols:
            reg_df = df[df['region'] == region].sort_values(date_col)
            reg_df = reg_df.rename(columns={date_col: 'ds', disease: 'y'})[['ds', 'y']]

            # Fill missing values
            reg_df['y'] = reg_df['y'].fillna(0)

            # Train Prophet model
            model = Prophet(daily_seasonality=False)
            model.fit(reg_df)

            future = model.make_future_dataframe(periods=7)
            forecast = model.predict(future)

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
                "disease": disease,
                "generated_at": datetime.utcnow().isoformat() + "Z",
                "forecast": out
            }

            # SHA256 for integrity
            payload_str = json.dumps(payload, sort_keys=True, separators=(',',':'))
            payload['sha256'] = hashlib.sha256(payload_str.encode()).hexdigest()

            all_forecasts[region][disease] = payload

    # Save a single JSON
    with open("ml/forecast.json","w") as f:
        json.dump(all_forecasts,f,indent=2)

    return all_forecasts
