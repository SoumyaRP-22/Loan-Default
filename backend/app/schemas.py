from pydantic import BaseModel, Field


class LoanApplication(BaseModel):

    revolving_utilization: float = Field(
        ge=0,
        description="Credit utilization ratio"
    )

    age: int = Field(
        ge=18,
        le=100,
        description="Borrower's age"
    )

    late_30_59: int = Field(
        ge=0,
        le=100,
        description="Number of times 30-59 days late"
    )

    debt_ratio: float = Field(
        ge=0,
        description="Debt ratio"
    )

    monthly_income: float = Field(
        ge=0,
        description="Monthly income"
    )

    open_credit_lines: int = Field(
        ge=0,
        le=1000,
        description="Number of open credit lines and loans"
    )

    late_90: int = Field(
        ge=0,
        le=100,
        description="Number of times 90+ days late"
    )

    real_estate_loans: int = Field(
        ge=0,
        le=100,
        description="Number of real estate loans or lines"
    )

    late_60_89: int = Field(
        ge=0,
        le=100,
        description="Number of times 60-89 days late"
    )

    dependents: int = Field(
        ge=0,
        le=20,
        description="Number of dependents"
    )