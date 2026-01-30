
# Mobility Cost Estimator - Backend Documentation

This document outlines the API endpoints, data structures, and logic required to support the Global Mobility Cost Estimator frontend.

## 1. Authentication
All requests should include a Bearer Token in the header for secure access to sensitive tax data.
`Authorization: Bearer <token>`

---

## 2. API Endpoints

### A. Get Configuration Data
Used to populate country dropdowns, current per diem rates, and available durations.
- **URL**: `GET /api/v1/config`
- **Response**: `200 OK`
```json
{
  "countries": [
    { "code": "FI", "name": "Finland", "currency": "EUR" },
    { "code": "BR", "name": "Brazil", "currency": "BRL" }
  ],
  "durations": [3, 6, 9, 12, 18, 24]
}
```

### B. Calculate Single Estimate
Performs the core calculation logic for one engineer.
- **URL**: `POST /api/v1/estimate/calculate`
- **Payload**: `EstimationInputs`
```json
{
  "homeCountry": "Finland",
  "hostCountry": "Brazil",
  "monthlySalary": 7000,
  "durationMonths": 6,
  "dailyAllowance": 72,
  "workingDaysPerMonth": 22
}
```
- **Response**: `EstimationResults` (includes breakdown of tax/SS calculations)

### C. Batch Processing
Handle multiple estimates via file upload.
- **URL**: `POST /api/v1/estimate/batch`
- **Payload**: `multipart/form-data` (CSV or XLSX file)
- **Response**: `202 Accepted`
- **Polling URL**: `GET /api/v1/estimate/batch/:id`

---

## 3. Data Models (Types)

### EstimationInputs
| Field | Type | Description |
|---|---|---|
| `homeCountry` | string | Origin country name or code |
| `hostCountry` | string | Destination country name or code |
| `monthlySalary` | number | Base monthly salary in EUR |
| `durationMonths` | number | Length of assignment |
| `dailyAllowance` | number | Per diem rate in EUR |
| `workingDaysPerMonth`| number | Avg working days (usually 20-22) |

### EstimationResults
| Field | Type | Description |
|---|---|---|
| `baseSalary` | number | Total base salary for full duration |
| `perDiem` | number | Total calculated daily allowance |
| `adminFees` | number | Processing/Compliance fees |
| `hostTax` | number | Calculated income tax in host country |
| `hostSocialSecurity` | number | Calculated employer SS contributions |
| `totalAdditionalCost` | number | Sum of all incremental costs |

---

## 4. Business Logic Notes

1. **Tax Calculation**: The backend should maintain a mapping of tax brackets for supported host countries.
   - Example: Brazil uses progressive brackets (0% to 27.5%).
2. **Social Security Agreements**: Check if a reciprocal SS agreement exists between `homeCountry` and `hostCountry`.
   - If agreement exists: `hostSocialSecurity` might be 0 or reduced.
   - If no agreement: Charge full local host rates.
3. **Per Diem Sourcing**: The `dailyAllowance` should be validated against the latest published rates (e.g., Finnish Tax Admin "Ulkomaanpäivärahat").
