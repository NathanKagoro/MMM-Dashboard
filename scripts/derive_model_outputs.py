"""Re-derive every number the dashboard shows from the raw CSV.

Reproduces the notebook's per-division MMM:
    Sales ~ log1p(Google) + log1p(Email) + log1p(Facebook) + log1p(Affiliate)
            + log1p(Organic_Views) + Trend + sin(2*pi*isoweek/52) + cos(2*pi*isoweek/52)
fitted with OLS (in-sample, no holdout), one model per Division.

Writes src/data/modelOutputs.json. Run from the repo root:
    python3 scripts/derive_model_outputs.py
Requires pandas, numpy, scikit-learn.
"""
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

ROOT = Path(__file__).resolve().parents[1]
CSV = ROOT / "data" / "raw" / "Sample Media Spend Data.csv"
OUT = ROOT / "src" / "data" / "modelOutputs.json"
CHANNELS = ["Google", "Email", "Facebook", "Affiliate"]
TOP_N = 6

df = pd.read_csv(CSV)
df["Calendar_Week"] = pd.to_datetime(df["Calendar_Week"])
df = df.sort_values("Calendar_Week", kind="stable")


def design(g: pd.DataFrame) -> pd.DataFrame:
    X = pd.DataFrame({c: np.log1p(g[f"{c}_Impressions"]) for c in CHANNELS})
    X["Organic"] = np.log1p(g["Organic_Views"])
    X["Trend"] = np.arange(len(g))
    wk = g["Calendar_Week"].dt.isocalendar().week.astype(int)
    X["sin_week"] = np.sin(2 * np.pi * wk / 52)
    X["cos_week"] = np.cos(2 * np.pi * wk / 52)
    return X


fits = []
for division, g in df.groupby("Division"):
    g = g.reset_index(drop=True)
    X = design(g)
    m = LinearRegression().fit(X, g["Sales"])
    fits.append(
        {
            "division": division,
            "r2": round(float(m.score(X, g["Sales"])), 4),
            "rows": int(len(g)),
            "model": m,
            "X": X,
            "g": g,
        }
    )

fits.sort(key=lambda f: f["r2"], reverse=True)
top = fits[:TOP_N]

divisions = []
for rank, f in enumerate(top, start=1):
    g, X, m = f["g"], f["X"], f["model"]
    pred = m.predict(X)
    coef = dict(zip(X.columns, m.coef_))
    divisions.append(
        {
            "division": f["division"],
            "rank": rank,
            "r2": f["r2"],
            "weeks": int(g["Calendar_Week"].nunique()),
            "meanWeeklySales": round(float(g["Sales"].mean()), 0),
            "channels": {
                c: {
                    "impressions": int(round(g[f"{c}_Impressions"].sum())),
                    "coefficient": round(float(coef[c]), 2),
                }
                for c in CHANNELS
            },
            "weekly": [
                {"week": d.strftime("%Y-%m-%d"), "actual": int(a), "predicted": int(round(p))}
                for d, a, p in zip(g["Calendar_Week"], g["Sales"], pred)
            ],
        }
    )

# Combined weekly series across the top divisions (sum of actual and of fitted values).
combined = (
    pd.concat(
        [pd.DataFrame(d["weekly"]) for d in divisions], ignore_index=True
    )
    .groupby("week", as_index=False)[["actual", "predicted"]]
    .sum()
    .sort_values("week")
)
ss_res = float(((combined.actual - combined.predicted) ** 2).sum())
ss_tot = float(((combined.actual - combined.actual.mean()) ** 2).sum())

out = {
    "source": "data/raw/Sample Media Spend Data.csv",
    "modelSpec": "Sales ~ log1p(Google, Email, Facebook, Affiliate impressions) + log1p(Organic views) + trend + weekly sin/cos seasonality; OLS per division, in-sample R²",
    "period": {
        "start": df["Calendar_Week"].min().strftime("%Y-%m-%d"),
        "end": df["Calendar_Week"].max().strftime("%Y-%m-%d"),
        "weeks": int(df["Calendar_Week"].nunique()),
    },
    "rows": int(len(df)),
    "duplicateWeekDivisions": sorted(
        d for d, g in df.groupby("Division") if g["Calendar_Week"].duplicated().any()
    ),
    "divisionCount": int(df["Division"].nunique()),
    "allDivisionR2": [{"division": f["division"], "r2": f["r2"], "rows": f["rows"]} for f in fits],
    "topDivisions": divisions,
    "combinedWeekly": combined.to_dict(orient="records"),
    "combinedR2": round(1 - ss_res / ss_tot, 4),
}
OUT.write_text(json.dumps(out, separators=(",", ":")) + "\n")
print(f"wrote {OUT.relative_to(ROOT)}: top={[d['division'] for d in divisions]} period={out['period']}")
