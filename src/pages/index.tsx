import React from "react";
import Head from "next/head";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";

import { getServerAuthSession } from "~/server/auth";
import { Loader } from "~/components/Loader";
import { api } from "~/utils/api";

import type { GetServerSideProps } from "next";

export default function Page() {
  const { data: yearly, isLoading: loadingYearly } = api.chart.pelamarYearly.useQuery();
  const { data: weekly, isLoading: loadingWeekly } = api.chart.pelamarWeekly.useQuery();

  if (loadingYearly || loadingWeekly) return <Loader />;

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
      </Head>

      <section className="grid h-[calc(100vh-80px-64px)] grid-cols-6 grid-rows-2 gap-5 lg:h-[calc(100vh-80px)]">
        <div className="relative col-span-6 overflow-hidden rounded-lg border">
          <h3 className="absolute right-0 top-0 z-10 rounded-bl-lg border-b border-l bg-white px-4 py-2 text-sm font-medium">Pelamar tahun ini</h3>
          <ResponsiveContainer>
            <AreaChart
              data={yearly?.result}
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

        <div className="relative col-span-6 overflow-hidden rounded-lg border">
          <h3 className="absolute right-0 top-0 z-10 rounded-bl-lg border-b border-l bg-white px-4 py-2 text-sm font-medium">Pelamar minggu ini</h3>
          <ResponsiveContainer>
            <BarChart
              data={weekly?.result}
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
                dataKey="total"
                tickLine={false}
                tick={{
                  fontSize: 12,
                  color: "#718096",
                }}
              />
              <Tooltip />
              <Bar type="monotone" dataKey="total" stroke="#6366f1" fill="#e0e7ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
