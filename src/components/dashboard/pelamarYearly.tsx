import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import type { RouterOutputs } from "~/utils/api";

type DataProps = RouterOutputs["chart"]["pelamarYearly"]["result"];

export const PelamarYearly = ({ data }: { data: DataProps }) => {
  return (
    <div className="relative col-span-6 overflow-hidden rounded-lg border">
      <h3 className="absolute right-0 top-0 z-10 rounded-bl-lg border-b border-l bg-white px-4 py-2 text-sm font-medium">Pelamar tahun ini</h3>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            left: -15,
            right: 30,
            top: 30,
            bottom: 5,
          }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            tick={{
              fontSize: 12,
              color: "#718096",
            }}
          />
          <YAxis
            dataKey="total"
            tickLine={false}
            tick={{
              fontSize: 12,
              color: "#718096",
            }}
          />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke="#6366f1" fill="#e0e7ff" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
