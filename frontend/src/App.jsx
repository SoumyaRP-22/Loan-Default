import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [formData, setFormData] = useState({
    revolving_utilization: "",
    age: "",
    late_30_59: "",
    debt_ratio: "",
    monthly_income: "",
    open_credit_lines: "",
    late_90: "",
    real_estate_loans: "",
    late_60_89: "",
    dependents: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleReset = () => {
  //   setFormData({
  //     revolving_utilization: "",
  //     age: "",
  //     late_30_59: "",
  //     debt_ratio: "",
  //     monthly_income: "",
  //     open_credit_lines: "",
  //     late_90: "",
  //     real_estate_loans: "",
  //     late_60_89: "",
  //     dependents: "",
  //   });

  //   setResult(null);
  //   setError("");
  // };

  const validateForm = () => {
    const errors = [];

    if (formData.revolving_utilization === "") {
      errors.push("Credit Utilization is required.");
    } else if (Number(formData.revolving_utilization) < 0) {
      errors.push("Credit Utilization cannot be negative.");
    }

    if (formData.age === "") {
      errors.push("Age is required.");
    } else if (Number(formData.age) < 18 || Number(formData.age) > 100) {
      errors.push("Age must be between 18 and 100.");
    }

    if (formData.late_30_59 === "") {
      errors.push("30-59 Days Late is required.");
    } else if (Number(formData.late_30_59) < 0) {
      errors.push("30-59 Days Late cannot be negative.");
    }

    if (formData.debt_ratio === "") {
      errors.push("Debt Ratio is required.");
    } else if (Number(formData.debt_ratio) < 0) {
      errors.push("Debt Ratio cannot be negative.");
    }

    if (formData.monthly_income === "") {
      errors.push("Monthly Income is required.");
    } else if (Number(formData.monthly_income) < 0) {
      errors.push("Monthly Income cannot be negative.");
    }

    if (formData.open_credit_lines === "") {
      errors.push("Open Credit Lines & Loans is required.");
    } else if (Number(formData.open_credit_lines) < 0) {
      errors.push("Open Credit Lines & Loans cannot be negative.");
    }

    if (formData.late_90 === "") {
      errors.push("90+ Days Late is required.");
    } else if (Number(formData.late_90) < 0) {
      errors.push("90+ Days Late cannot be negative.");
    }

    if (formData.real_estate_loans === "") {
      errors.push("Real Estate Loans is required.");
    } else if (Number(formData.real_estate_loans) < 0) {
      errors.push("Real Estate Loans cannot be negative.");
    }

    if (formData.late_60_89 === "") {
      errors.push("60-89 Days Late is required.");
    } else if (Number(formData.late_60_89) < 0) {
      errors.push("60-89 Days Late cannot be negative.");
    }

    if (formData.dependents === "") {
      errors.push("Dependents is required.");
    } else if (
      Number(formData.dependents) < 0 ||
      Number(formData.dependents) > 20
    ) {
      errors.push("Dependents must be between 0 and 20.");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          revolving_utilization: Number(formData.revolving_utilization),
          age: Number(formData.age),
          late_30_59: Number(formData.late_30_59),
          debt_ratio: Number(formData.debt_ratio),
          monthly_income: Number(formData.monthly_income),
          open_credit_lines: Number(formData.open_credit_lines),
          late_90: Number(formData.late_90),
          real_estate_loans: Number(formData.real_estate_loans),
          late_60_89: Number(formData.late_60_89),
          dependents: Number(formData.dependents),
        }),
      });

      const data = await response.json();

      /* Handle validation errors */
      if (!response.ok) {

        if (response.status === 422 && data.detail) {

          const messages = data.detail.map((error) => {
            const field = error.loc[error.loc.length - 1];

            return `${field}: ${error.msg}`;
          });

          throw new Error(messages.join("\n"));
        }

        throw new Error(
          data.detail || "Prediction request failed."
        );
      }

      setResult(data);

    } catch (err) {

      setError(
        err.message || "Unable to connect to the prediction server."
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>

      <div className="theme-toggle">
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <h1>Loan Default Prediction</h1>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Credit Utilization</label>
          <input
            type="number"
            step="any"
            min="0"
            name="revolving_utilization"
            value={formData.revolving_utilization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            min="18"
            max="100"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>30-59 Days Late</label>
          <input
            type="number"
            min="0"
            max="100"
            name="late_30_59"
            value={formData.late_30_59}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Debt Ratio</label>
          <input
            type="number"
            step="any"
            min="0"
            name="debt_ratio"
            value={formData.debt_ratio}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Monthly Income</label>
          <input
            type="number"
            min="0"
            step="any"
            name="monthly_income"
            value={formData.monthly_income}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Open Credit Lines & Loans</label>
          <input
            type="number"
            min="0"
            max="1000"
            name="open_credit_lines"
            value={formData.open_credit_lines}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>90+ Days Late</label>
          <input
            type="number"
            min="0"
            max="100"
            name="late_90"
            value={formData.late_90}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Real Estate Loans</label>
          <input
            type="number"
            min="0"
            max="100"
            name="real_estate_loans"
            value={formData.real_estate_loans}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>60-89 Days Late</label>
          <input
            type="number"
            min="0"
            max="100"
            name="late_60_89"
            value={formData.late_60_89}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Dependents</label>
          <input
            type="number"
            min="0"
            max="20"
            name="dependents"
            value={formData.dependents}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Risk"}
        </button>

        {/* <button
          type="button"
          onClick={handleReset}
          disabled={loading}
        >
          Reset Form
        </button> */}

      </form>

      {loading && (
        <p className="loading">
          Analyzing application...
        </p>
      )}

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {result && (
        <div className="result">

          <h2>Prediction Result</h2>

          {/* Main Result */}
          <div
            className={`risk-card ${result.risk === "High" ? "risk-high" : "risk-low"
              }`}
          >
            <div className="risk-icon">
              {result.risk === "High" ? "⚠️" : "✓"}
            </div>

            <div className="risk-content">
              <span className="risk-label">
                Risk Level
              </span>

              <h2>{result.risk} Risk</h2>

              <p>
                {result.prediction === 1
                  ? "The model predicts that this borrower is likely to default."
                  : "The model predicts that this borrower is unlikely to default."}
              </p>
            </div>
          </div>


          {/* Probability */}
          <div className="probability-section">

            <div className="probability-header">
              <h3>Default Probability</h3>

              <strong>
                {(result.probability * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="progress-bar">

              <div
                className={`progress ${result.risk === "High"
                  ? "progress-high"
                  : "progress-low"
                  }`}
                style={{
                  width: `${result.probability * 100}%`
                }}
              ></div>

            </div>

            <p className="threshold-text">
              Decision threshold: {(0.20 * 100).toFixed(0)}%
            </p>

          </div>


          {/* Prediction Summary */}
          <div className="prediction-summary">

            <div className="summary-item">
              <span>Prediction</span>

              <strong>
                {result.prediction === 1
                  ? "Default"
                  : "No Default"}
              </strong>
            </div>

            <div className="summary-item">
              <span>Probability</span>

              <strong>
                {(result.probability * 100).toFixed(2)}%
              </strong>
            </div>

            <div className="summary-item">
              <span>Decision Threshold</span>

              <strong>20%</strong>
            </div>

          </div>


          {/* SHAP Explanation */}
          {result.explanation && (
            <div className="explanation">

              <h3>
                Why did the model make this prediction?
              </h3>

              <p className="explanation-subtitle">
                These are the features that had the largest
                influence on this prediction.
              </p>


              <div className="explanation-list">

                {result.explanation.map((item, index) => (

                  <div
                    className="explanation-item"
                    key={index}
                  >

                    <div className="explanation-feature">

                      <span className="feature-number">
                        {index + 1}
                      </span>

                      <strong>
                        {item.feature}
                      </strong>

                    </div>


                    <div
                      className={
                        item.impact === "Higher risk"
                          ? "higher-risk"
                          : "lower-risk"
                      }
                    >
                      {item.impact}
                    </div>

                  </div>

                ))}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default App;