import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();

  // Pages that have their own navbar/sidebar layout
  const pagesWithCustomLayout = [
    "/dashboard",
    "/countryData",
    "/countries",
    "/settings",
    "/login",
  ];
  const hideGlobalNavbar = pagesWithCustomLayout.includes(router.pathname);

  return (
    <SessionProvider session={session}>
      {!hideGlobalNavbar && <Navbar />}
      <Component {...pageProps} />
    </SessionProvider>
  );
}
