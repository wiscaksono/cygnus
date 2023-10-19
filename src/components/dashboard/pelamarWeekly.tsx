import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import type { RouterOutputs } from "~/utils/api";

type DataProps = RouterOutputs["chart"]["pelamarWeekly"]["result"];

export const PelamarWeekly = ({ data }: { data: DataProps }) => {
  return (
    <div className="relative col-span-6 overflow-hidden rounded-lg border">
      <h3 className="absolute right-0 top-0 z-10 rounded-bl-lg border-b border-l bg-white px-4 py-2 text-sm font-medium">Pelamar minggu ini</h3>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            left: -15,
            right: 30,
            top: 30,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickLine={false}
            tick={{
              fontSize: 12,
              color: "#718096",
            }}
          />
          <YAxis
            allowDecimals={false}
            dataKey="pelamar"
            tickLine={false}
            tick={{
              fontSize: 12,
              color: "#718096",
            }}
          />
          <Tooltip />
          <Bar stackId={1} type="monotone" dataKey="pelamar" stroke="#6366f1" fill="#e0e7ff" />
          <Bar stackId={1} type="monotone" dataKey="diterima" stroke="#54a170" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
