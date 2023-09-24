import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { api } from "~/utils/api";
import { authOptions } from "~/server/auth";

import type { GetServerSideProps, GetServerSidePropsContext } from "next";

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
      <p>{data.templateWhatsApp}</p>
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
