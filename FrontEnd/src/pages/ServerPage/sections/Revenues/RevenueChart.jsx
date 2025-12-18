import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { vnd } from "../../utils";
import styles from "./RevenueChart.module.scss";

const RevenueChart = ({ chartData }) => {
  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.chartTitle}>Biểu đồ doanh thu hệ thống</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} />
          <Tooltip formatter={(val) => vnd(val)} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#2980b9"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Doanh thu"
          />
          <Line
            type="monotone"
            dataKey="paid"
            stroke="#27ae60"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Đã chi cho quán"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
