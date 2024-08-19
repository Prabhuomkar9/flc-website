import { ImageResponse } from "@vercel/og";
import type { NextApiRequest } from "next";

import { env } from "~/env";

export const config = {
  runtime: "edge",
};

export default function handler(req: NextApiRequest) {
  if (!req.url) return;
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
          padding: "2rem 4rem",
          color: "#fff",
          backgroundColor: "#212124",
          fontSize: 32,
          fontWeight: 600,
        }}
      >
        <div
          style={{
            width: "50%",
            height: "100%",
            backgroundColor: "#fff",
            border: "1px solid red",
            borderRadius: "10px",
          }}
        ></div>
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid red",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height={120}
              src={`${env.NEXTAUTH_URL}/assets/images/flc_logo_crop.png`}
              alt="Finite Loop Club"
            />
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
              }}
            >
              Finite Loop Club
            </div>
          </div>
          <div>finiteloop.co.in</div>
          <div>{page}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
