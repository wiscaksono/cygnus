import React from "react";
import Head from "next/head";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

import { getServerAuthSession } from "~/server/auth";
import { Loader } from "~/components/Loader";
import { api } from "~/utils/api";

import type { GetServerSideProps } from "next";

export default function Page() {
  const { data, isLoading } = api.chart.pelamar.useQuery();

  if (isLoading) return <Loader />;

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="grid h-[calc(100vh-80px)] grid-cols-6 grid-rows-2 gap-5">
        <ResponsiveContainer className="col-span-6 rounded-lg border">
          <AreaChart
            data={data?.result.monthly}
            margin={{
              left: -15,
              right: 30,
              top: 30,
              bottom: 5,
            }}
          >
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
        <ResponsiveContainer className="col-span-6 rounded-lg border">
          <AreaChart
            data={data?.result.daily}
            margin={{
              left: -15,
              right: 30,
              top: 30,
              bottom: 5,
            }}
          >
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
            <Area type="monotone" dataKey="total" stroke="#6366f1" fill="#e0e7ff" />
          </AreaChart>
        </ResponsiveContainer>
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
