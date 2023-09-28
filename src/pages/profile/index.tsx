import Head from "next/head";
import { getServerAuthSession } from "~/server/auth";

import { ProfileForm } from "~/components/profile/form/ProfileForm";
import { EmailForm } from "~/components/profile/form/EmailForm";

import type { GetServerSideProps } from "next";

export default function Profile() {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Cygnus" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProfileForm />
      <hr />
      <EmailForm />
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
