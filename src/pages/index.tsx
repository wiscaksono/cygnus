import React from "react";
import Head from "next/head";

import { getServerAuthSession } from "~/server/auth";
import { api } from "~/utils/api";

import type { GetServerSideProps } from "next";

export default function Page() {
  const mutation = api.pelamar.sendEmail.useMutation({
    onSuccess: (res) => {
      console.log(res);
    },
  });

  const handleSendEmail = () => {
    mutation.mutate();
  };

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={() => handleSendEmail()}>aaaa</button>
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
