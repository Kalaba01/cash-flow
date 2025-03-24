import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { TopBar, Footer, GoTop } from "@/components";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopBar />
      <Component {...pageProps} />
      <Footer />
      <GoTop />
    </>
  );
}
