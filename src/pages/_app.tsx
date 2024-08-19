import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReactLenis } from "lenis/react";
import { type GetServerSideProps, type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

import Layout from "~/components/layout";
import SEOLayout from "~/components/layout/seo";
import { siteMetaData } from "~/constants";
import { ThemeProvider } from "~/context/themeContext";
import { env } from "~/env";
import "~/styles/globals.css";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps<{
  ogImageUrl: string;
}> = async (context: GetServerSidePropsContext) => {
  const ogImageUrl = `${env.NEXTAUTH_URL}/api/og-image?page=${context.resolvedUrl}`;

  return {
    props: {
      ogImageUrl,
    },
  };
};

const MyApp: AppType<{ session: Session | null; ogImageUrl: string }> = ({
  Component,
  pageProps: { session, ogImageUrl, ...pageProps },
}) => {
  const { pathname } = useRouter();

  // Set the title of the page dynamically
  const title = `${
    pathname === "/"
      ? "Home | "
      : pathname.split("/")[1]!.charAt(0).toUpperCase() +
        pathname.split("/")[1]!.slice(1) +
        " | "
  }${siteMetaData.title}`;

  return (
    <SessionProvider session={session}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={["light", "dark"]}
      >
        <ReactLenis root>
          <Head>
            <title>{title}</title>
          </Head>
          <SEOLayout ogImageUrl={ogImageUrl}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SEOLayout>
          <Analytics />
          <SpeedInsights />
        </ReactLenis>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
