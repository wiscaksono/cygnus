import React from "react";
import Head from "next/head";

import { getServerAuthSession } from "~/server/auth";
import { Loader } from "~/components/Loader";
import { PelamarYearly } from "~/components/dashboard/pelamarYearly";
import { PelamarWeekly } from "~/components/dashboard/pelamarWeekly";
import { api } from "~/utils/api";

import type { GetServerSideProps } from "next";

export default function Page() {
  const { data: pelamarYearly, isLoading: loadingPelamarYearly } = api.chart.pelamarYearly.useQuery();
  const { data: pelamarWeekly, isLoading: loadingPelamarWeekly } = api.chart.pelamarWeekly.useQuery();

  if (loadingPelamarYearly || loadingPelamarWeekly) return <Loader />;

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
      </Head>

      <section className="grid h-[calc(100vh-80px-64px)] grid-cols-6 grid-rows-2 gap-5 lg:h-[calc(100vh-80px)]">
        <PelamarYearly data={pelamarYearly?.result!} />
        <PelamarWeekly data={pelamarWeekly?.result!} />
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
