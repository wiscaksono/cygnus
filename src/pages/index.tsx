import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { api } from "~/utils/api";

import whatsApp from "~/server/whatsApp";
import { authOptions } from "~/server/auth";

import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export default () => {
  const { data } = api.user.getSelf.useQuery();
  console.log(data);

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <code className="whitespace-pre-line font-mono">
        {data?.templateWhatsApp}
      </code>

      <p className="whitespace-pre-line">test \n\n aaa</p>
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
