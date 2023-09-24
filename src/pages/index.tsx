import React from "react";
import Head from "next/head";

import { api } from "~/utils/api";
import { getServerAuthSession } from "~/server/auth";

import type { GetServerSideProps } from "next";

export default () => {
  const { data } = api.user.getSelf.useQuery();

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

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
