import React from "react";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { toast } from "react-toastify";

import whatsApp from "~/server/whatsApp";
import { authOptions } from "~/server/auth";

import type { GetServerSideProps, GetServerSidePropsContext } from "next";

export default () => {
  const sendWhatsapp = async () => {
    const { message } = await whatsApp.sendMessage({
      number: "082293256385",
      message: "TESTING",
    });
    toast.success(message);
  };

  return (
    <>
      <Head>
        <title>Cygnus - Dashboard</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-5xl font-extrabold tracking-tight">duar memek</h1>
      <button onClick={sendWhatsapp}>Send whatsapp</button>
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
