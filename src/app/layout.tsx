import Layout from "@/providers/Layout";
import { TelegramProvider } from "@/providers/TelegramProvider";
import AppKitProvider from "@/providers/Web3Provider";
import { config } from "@/utils/config";
import "@telegram-apps/telegram-ui/dist/styles.css";
import type { Metadata } from "next";
import { Be_Vietnam_Pro, Outfit } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const beVietnamPro = Be_Vietnam_Pro({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-beVietnamPro",
});

export const metadata: Metadata = {
  title: "TapTapZoo Mini Game",
  description: "A fun mini game where you can tap and collect rewards",
};

export const fetchCache = "force-no-store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html
      lang="en"
      className={`h-screen ${outfit.variable} ${beVietnamPro.variable}`}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={beVietnamPro.className}>
        <AppKitProvider initialState={initialState}>
          <TelegramProvider>
            <Layout>{children}</Layout>
          </TelegramProvider>
        </AppKitProvider>
      </body>
    </html>
  );
}
