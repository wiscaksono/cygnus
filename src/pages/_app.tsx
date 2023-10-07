import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "sonner";
import Head from "next/head";

import { api } from "~/utils/api";
import Layout from "~/components/layout";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <>
      <Head>
        <title>Cygnus</title>
      </Head>

      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
          <Toaster position="bottom-right" richColors />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
