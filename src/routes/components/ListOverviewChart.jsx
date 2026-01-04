// src/routes/components/ListOverviewChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePreferences } from "../../context/PreferencesContext";

function ListOverviewChart({ data, title }) {
  const { t } = usePreferences();

  if (!data.length) {
    return <p className="row-label-muted">{t("detail.emptyStats")}</p>;
  }

  return (
    <div className="chart-wrapper">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: "var(--text-muted)", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--panel-bg)",
              borderColor: "var(--border)",
              color: "var(--text-main)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-soft)",
            }}
            formatter={(value) => [value, t("items.title")]}
          />
          <Bar dataKey="itemsCount" fill="var(--chart-items)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ListOverviewChart;
