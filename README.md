# MMM Dashboard

An interactive Media Mix Modelling (MMM) dashboard built with React and TypeScript. It presents the outputs of a Python notebook that fits OLS regression models to weekly media spend and sales data across six business divisions, and lets analysts explore the results without opening the notebook.

Live at [nathankagoro.com](https://nathankagoro.com).

---

## What it does

The notebook reads a weekly media spend CSV, engineers MMM features (log transforms, trend index, seasonal cycles), fits a separate linear model per business division, and saves coefficients, contribution breakdowns, and predictions. This dashboard is the front-end layer on top of those results.

### Pages

| Page | Purpose |
|---|---|
| **Overview** | High-level KPI summary, trend chart, campaign heatmap, and key insight carousel |
| **Campaigns** | Campaign-level table with spend/sales scatter and performance comparison |
| **Sales** | Revenue, orders, and AOV charts with a category treemap and sticky filter bar |
| **Data** | Full model methodology — pipeline steps, model equation, R² leaderboard, per-division channel deep-dive, and limitations |

### Model

```
Sales = ß0 + ß1·log(Google) + ß2·log(Email) + ß3·log(Facebook)
      + ß4·log(Affiliate) + ß5·log(Organic) + ß6·Trend
      + ß7·sin_week + ß8·cos_week
```

Six divisions are modelled independently (Y, D, H, I, M, Q). Division Y achieves the highest R² of 0.668. Email is the strongest channel by coefficient across most divisions; Affiliate is frequently near zero or negative.

---

## Tech stack

- **React 19** + **TypeScript 4.9**
- **Framer Motion 12** — scroll-triggered animations and background blobs
- **Recharts 3** — bar charts and scatter plots
- **Tailwind CSS 3** — utility-first styling with glass-card aesthetics
- **Lucide React** — icons
- **React Router 6** — client-side routing

---

## Running locally

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production bundle
```
