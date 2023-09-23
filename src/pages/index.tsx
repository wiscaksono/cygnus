import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";

import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export default () => {
  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-5xl font-extrabold tracking-tight">duar memek</h1>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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
