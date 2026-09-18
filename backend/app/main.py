from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import shap
from pathlib import Path

from app.schemas import LoanApplication


app = FastAPI(
    title="Loan Default Prediction API",
    description="API for predicting loan default risk",
    version="1.0.0"
)

BASE_DIR = Path(__file__).resolve().parent.parent

model = joblib.load(
    BASE_DIR / "models" / "xgb_model.pkl"
)

threshold = joblib.load(
    BASE_DIR / "models" / "threshold.pkl"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://loan-default-beta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


explainer = shap.TreeExplainer(
    model.named_steps["model"]
)


@app.get("/")
def root():
    return {
        "message": "Loan Default Prediction API is running"
    }


@app.post("/predict")
def predict(application: LoanApplication):

    data = {
        "RevolvingUtilizationOfUnsecuredLines":
            application.revolving_utilization,

        "age":
            application.age,

        "NumberOfTime30-59DaysPastDueNotWorse":
            application.late_30_59,

        "DebtRatio":
            application.debt_ratio,

        "MonthlyIncome":
            application.monthly_income,

        "NumberOfOpenCreditLinesAndLoans":
            application.open_credit_lines,

        "NumberOfTimes90DaysLate":
            application.late_90,

        "NumberRealEstateLoansOrLines":
            application.real_estate_loans,

        "NumberOfTime60-89DaysPastDueNotWorse":
            application.late_60_89,

        "NumberOfDependents":
            application.dependents
    }

    df = pd.DataFrame([data])

    # Model prediction
    probability = model.predict_proba(df)[0][1]

    prediction = int(
        probability >= threshold
    )

    risk = (
        "High"
        if prediction == 1
        else "Low"
    )

    # Prepare data for SHAP
    X_processed = model.named_steps[
        "imputer"
    ].transform(df)

    # SHAP values
    shap_values = explainer.shap_values(
        X_processed
    )

    feature_names = {
        "RevolvingUtilizationOfUnsecuredLines":
            "Credit Utilization",

        "age":
            "Age",

        "NumberOfTime30-59DaysPastDueNotWorse":
            "30-59 Days Late Payments",

        "DebtRatio":
            "Debt Ratio",

        "MonthlyIncome":
            "Monthly Income",

        "NumberOfOpenCreditLinesAndLoans":
            "Open Credit Lines & Loans",

        "NumberOfTimes90DaysLate":
            "90+ Days Late Payments",

        "NumberRealEstateLoansOrLines":
            "Real Estate Loans",

        "NumberOfTime60-89DaysPastDueNotWorse":
            "60-89 Days Late Payments",

        "NumberOfDependents":
            "Dependents"
    }

    explanations = []

    for feature, shap_value in zip(
        df.columns,
        shap_values[0]
    ):

        explanations.append({
            "feature": feature_names[feature],
            "impact": (
                "Higher risk"
                if shap_value > 0
                else "Lower risk"
            ),
            "shap_value": round(
                float(shap_value),
                4
            )
        })

    explanations.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    explanations = explanations[:5]

    return {
        "prediction": prediction,
        "probability": round(
            float(probability),
            4
        ),
        "risk": risk,
        "explanation": explanations
    }