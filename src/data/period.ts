import { model } from "./model";
import { formatDay, formatMonthYear } from "../lib/format";

/** The true period covered by the raw CSV (week-ending dates). */
export const PERIOD = model.period;
export const PERIOD_SHORT = `${formatMonthYear(PERIOD.start)} to ${formatMonthYear(PERIOD.end)}`;
export const PERIOD_LABEL = `${PERIOD.weeks} weeks · ${formatDay(PERIOD.start)} to ${formatDay(PERIOD.end)}`;
