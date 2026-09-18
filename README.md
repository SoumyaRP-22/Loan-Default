<div align="center">

# 💳 Loan Default Prediction

### Explainable Machine Learning System for Credit Risk Prediction

Predict loan default risk using **XGBoost** and understand the factors behind each prediction using **SHAP**.

<br>

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=for-the-badge)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SHAP](https://img.shields.io/badge/SHAP-Explainable_AI-8A2BE2?style=for-the-badge)

</div>

---

## 📌 About

This project is a machine learning-based web application that predicts whether a borrower is likely to default on a loan.

The system takes financial and credit-related information as input and provides:

- 🎯 Default / No Default prediction
- 📊 Default probability
- ⚠️ Risk level
- 🔍 SHAP-based explanation of the prediction

The machine learning model is built using **XGBoost**, while **FastAPI** serves the model through a REST API and **React** provides the user interface.

---

## ✨ Features

- XGBoost-based loan default prediction
- Probability-based risk assessment
- SHAP model explainability
- Handling of imbalanced data
- Threshold tuning
- Input validation
- Interactive React frontend
- FastAPI backend
- Light / Dark mode
- Responsive interface

---

## 🧠 Machine Learning

### Dataset

The project uses the **Give Me Some Credit** dataset.

The target variable is:

```text
SeriousDlqin2yrs
```

```text
0 → No Default
1 → Default
```

### Models Explored

- Logistic Regression
- Class-Weighted Logistic Regression
- SMOTE + Logistic Regression
- Random Forest
- XGBoost

The final model uses **XGBoost**.

### Final Model

```text
n_estimators = 200
max_depth = 5
learning_rate = 0.05
```

Classification threshold:

```text
0.20
```

---

## 📊 Model Performance

| Metric | Score |
|---|---:|
| Accuracy | 93.75% |
| Precision | 40.10% |
| Recall | 51.32% |
| F1 Score | 45.02% |
| ROC-AUC | 86.93% |
| PR-AUC | 40.91% |

---

## 🔍 Explainable AI

The project uses **SHAP (SHapley Additive exPlanations)** to explain individual predictions.

For every prediction, the system identifies the top features contributing to the model's decision and indicates whether each feature increased or decreased the predicted risk.

Example:

```text
Prediction: No Default
Risk: Low
Default Probability: 9.76%

Top Factors:
• Credit Utilization
• 30-59 Days Late Payments
• 90+ Days Late Payments
• 60-89 Days Late Payments
• Age
```

---

## 🛠️ Tech Stack

**Machine Learning**

Python • Pandas • NumPy • Scikit-learn • XGBoost • SHAP

**Backend**

FastAPI • Pydantic • Uvicorn

**Frontend**

React • Vite • JavaScript • CSS

**Tools**

Git • GitHub • VS Code

---

## 🚀 Run Locally

### Backend

```bash
cd backend
```

Create and activate the virtual environment:

```bash
python -m venv venv
```

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
uvicorn app.main:app --reload
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

---


---


</div>