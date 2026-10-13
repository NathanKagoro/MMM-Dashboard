import { CHANNELS, model, doublingEffect } from "../../../data/model";
import { DIVERGING, divergingColor, textOn } from "../../../lib/diverging";
import { formatCurrency } from "../../../lib/format";

const divisions = model.topDivisions;
const effects = divisions.flatMap((d) => CHANNELS.map((c) => doublingEffect(d.channels[c].coefficient)));
const maxAbs = Math.max(...effects.map(Math.abs));
const legendStops = [-1, -0.25, 0, 0.25, 1].map((t) => t * maxAbs);

/**
 * Division × channel grid of the modelled effect of doubling a channel's impressions.
 * Every cell prints its value; colour is a diverging scale (lavender → deep purple positive, rose negative).
 */
export default function CampaignHeatmap() {
  return (
    <div>
      <div>
        <table className="w-full table-fixed border-separate border-spacing-1 text-sm">
          <caption className="sr-only">Weekly sales change if a channel's impressions double, by division</caption>
          <thead>
            <tr>
              <th scope="col" className="w-7 text-left text-xs font-semibold text-ink-muted">
                Div.
              </th>
              {CHANNELS.map((c) => (
                <th key={c} scope="col" className="truncate pb-1 text-center text-[11px] font-semibold text-ink-2 sm:text-xs">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {divisions.map((d) => (
              <tr key={d.division}>
                <th scope="row" className="text-left font-semibold text-ink">
                  {d.division}
                </th>
                {CHANNELS.map((c) => {
                  const v = doublingEffect(d.channels[c].coefficient);
                  const bg = divergingColor(v, maxAbs);
                  return (
                    <td
                      key={c}
                      title={`Division ${d.division} · ${c}: ${formatCurrency(v)} per week if impressions double`}
                      className="num h-11 whitespace-nowrap rounded-md text-center text-xs font-semibold sm:text-[13px]"
                      style={{ background: bg, color: textOn(bg) }}
                    >
                      {/* Whole thousands keep "−£114K" inside a phone-width cell. */}
                      {formatCurrency(v, { compact: true, digits: 0 })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <div
          aria-hidden="true"
          data-legend="diverging-scale"
          className="h-2.5 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${legendStops.map((v) => divergingColor(v, maxAbs)).join(",")})`,
          }}
        />
        <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
          <span>
            <span className="font-semibold" style={{ color: DIVERGING.negative }}>
              ●
            </span>{" "}
            Lowers sales
          </span>
          <span>No effect</span>
          <span>
            Raises sales{" "}
            <span className="font-semibold" style={{ color: DIVERGING.positive }}>
              ●
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
