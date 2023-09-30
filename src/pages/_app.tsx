import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { ToastContainer } from "react-toastify";
import Head from "next/head";

import { api } from "~/utils/api";
import Layout from "~/components/layout";

import "~/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Cygnus</title>
      </Head>

      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
