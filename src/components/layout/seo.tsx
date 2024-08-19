import Head from "next/head";
import React, { type FunctionComponent, type ReactNode } from "react";

const SEOLayout: FunctionComponent<{
  children: ReactNode;
  ogImageUrl: string;
}> = ({ children, ogImageUrl }) => {
  return (
    <>
      <Head>
        <meta property="og:image" content={ogImageUrl} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Head>
      {children}
    </>
  );
};

export default SEOLayout;
