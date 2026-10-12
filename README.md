# MMM Dashboard

An interactive Media Mix Modelling (MMM) dashboard built with React and TypeScript. It presents per-division OLS regressions of weekly sales on channel impressions (Jan 2018 – Feb 2020, 113 weeks, 26 divisions; the six best-fitting divisions are shown), and lets analysts explore the results without opening a notebook.

Live at [nathankagoro.github.io/MMM-Dashboard](https://nathankagoro.github.io/MMM-Dashboard/), and linked from [nathankagoro.com](https://nathankagoro.com).

---

## What it does

The notebook reads a weekly media spend CSV, engineers MMM features (log transforms, trend index, seasonal cycles), fits a separate linear model per business division, and saves coefficients, contribution breakdowns, and predictions. This dashboard is the front-end layer on top of those results.

### Pages

| Page | Purpose |
|---|---|
| **Overview** | KPI strip, actual vs predicted weekly sales, division × channel effect heatmap |
| **Campaigns** | Per-division reach vs effect scatter and channel effectiveness table (impressions, coefficient, effect of doubling, rank) |
| **Sales** | Monthly model fit, average channel effect, reach by channel, per-division spread, recommendations |
| **Data** | Methodology — pipeline, model equation, R² for all divisions, per-division deep-dive, limitations |

### Where the numbers come from

Every figure is generated from `data/raw/Sample Media Spend Data.csv` by `scripts/derive_model_outputs.py` (pandas + scikit-learn), which writes `src/data/modelOutputs.json`. Re-run it after changing the data or model:

```bash
python3 scripts/derive_model_outputs.py
```

The dataset has impressions and sales but **no spend**, so the dashboard does not report cost or ROI. Channel effects are shown as the modelled change in weekly sales if a channel's impressions doubled (β × ln 2, because channels enter the model as log(1 + impressions)).

### Model

```
Sales = β0 + β1·log(Google) + β2·log(Email) + β3·log(Facebook)
      + β4·log(Affiliate) + β5·log(Organic) + β6·Trend
      + β7·sin_week + β8·cos_week
```

One model is fitted per division (26 in total); the dashboard focuses on the six with the highest in-sample R² (Y, D, H, I, M, Q; mean 0.643, Division Y highest at 0.668). Email has the largest positive coefficient in all six; Affiliate is negative in all six.

---

## Tech stack

- **React 19** + **TypeScript 4.9**
- **Recharts 3** — bar charts and scatter plots
- **Tailwind CSS 3** — utility-first styling with glass-card aesthetics
- **Lucide React** — icons
- **React Router 7** — client-side routing

---

## Running locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test        # unit tests (formatting, model-derived metrics, app smoke test)
npm run build   # production bundle
```

CI (`.github/workflows/ci.yml`) runs tests and a build on pull requests and on pushes to non-main branches; `pages.yml` deploys `main` to GitHub Pages.
