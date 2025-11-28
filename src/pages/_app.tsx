import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Pages that have their own navbar/sidebar layout
  const pagesWithCustomLayout = [
    "/dashboard",
    "/countryData",
    "/countries",
    "/settings",
  ];
  const hideGlobalNavbar = pagesWithCustomLayout.includes(router.pathname);

  return (
    <>
      {!hideGlobalNavbar && <Navbar />}
      <Component {...pageProps} />
    </>
  );
}
