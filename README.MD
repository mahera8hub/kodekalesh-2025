# OutbrAIk – Early Disease Forecasting Web App

## Project Overview
OutbrAIk is an **early warning system for infectious diseases** that leverages historical climate and disease data to forecast outbreaks like dengue and malaria. Public health agencies can use this system to **proactively respond** before a disease spreads widely, enabling timely resource allocation, awareness campaigns, and preventive measures.

This hackathon MVP demonstrates **real-time forecasting, SHA256 verification**, and a **clean web interface** for viewing predictions.

---

## **Features**
- **Region-wise Forecasting:** Select a region to see disease predictions.  
- **Multiple Diseases:** Supports dengue and malaria predictions.  
- **Prophet-based ML Model:** Accurate, time-series forecasting.  
- **SHA256 Hash:** Provides a unique hash of the forecast payload for verification.  
- **React Frontend:** Interactive, user-friendly interface.  
- **FastAPI Backend:** Serves forecast data in JSON format.  
- **Optional S3 Upload:** Forecast can be uploaded to S3 for external storage.  

---

## **Folder Structure**

kodekalesh-2025/
│
├── backend/
│ ├── main.py # FastAPI backend
│ ├── requirements.txt # Python dependencies
│ ├── .env # Configuration (BUCKET, S3_KEY, etc.)
│ └── ml/
│ ├── forecast.py # Prophet forecasting script
│ └── climate_disease_dataset.csv
│
├── frontend/
│ ├── package.json
│ ├── public/
│ │ └── index.html
│ └── src/
│ ├── App.jsx
│ └── Forecast.jsx
│
├── README.md
└── .gitignore


---

## **Installation & Setup**

### **Backend**
1. Navigate to backend folder:
```bash
cd backend
Create a Python virtual environment:

python -m venv venv


Activate venv:

source venv/Scripts/activate   # Git Bash
# OR venv\Scripts\activate      # Command Prompt


Install dependencies:

pip install -r requirements.txt


Run FastAPI backend:

uvicorn main:app --reload


Visit http://127.0.0.1:8000/docs for API docs.

Frontend

Navigate to frontend folder:

cd frontend


Install npm dependencies:

npm install


Run frontend:

npm start


Visit http://localhost:3000 to view the app.

Usage

The frontend fetches forecast data from the FastAPI backend.

Users can select a region and disease to generate forecasts.

Forecast results include predicted cases, lower/upper bounds, and SHA256 hash for verification.

Technologies Used

Backend: Python, FastAPI, Prophet, pandas, boto3

Frontend: React, Axios, JavaScript/JSX

Version Control: Git

Optional Cloud: AWS S3 (for storing forecast JSON)

Evaluation Points

Clear folder structure with separation of backend/frontend.

Accurate time-series disease prediction with Prophet.

SHA256 payload ensures integrity and verifiability.

Interactive and responsive frontend.

Easily deployable on AWS or local machine.

Future Improvements

Add real-time alert system for health authorities.

Integrate multi-region dashboard with comparative visualizations.

Deploy on AWS Amplify (frontend) + EC2 / Lambda (backend) for production use.
