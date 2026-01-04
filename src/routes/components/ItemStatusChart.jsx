// src/routes/components/ItemStatusChart.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { usePreferences } from "../../context/PreferencesContext";

const COLORS = ["var(--chart-resolved)", "var(--chart-unresolved)"];

function ItemStatusChart({ resolvedCount, unresolvedCount }) {
  const { t } = usePreferences();
  const total = resolvedCount + unresolvedCount;

  if (total === 0) {
    return <p className="row-label-muted">{t("detail.emptyStats")}</p>;
  }

  const data = [
    { name: t("detail.resolved"), value: resolvedCount },
    { name: t("detail.unresolved"), value: unresolvedCount },
  ];

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            stroke="var(--panel-bg)"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--panel-bg)",
              borderColor: "var(--border)",
              color: "var(--text-main)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-soft)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-meta">
        <span className="row-label-muted">
          {t("items.shown", { count: total })}
        </span>
      </div>
    </div>
  );
}

export default ItemStatusChart;
