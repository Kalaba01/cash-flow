import "@/styles/globals.scss";
import Head from "next/head";
import type { AppProps } from "next/app";
import { TopBar, Footer, GoTop } from "@/components";
import { useInitializeLanguage } from "@/store/useLanguageStore";
import { useInitializeTheme } from "@/store/useThemeStore";
import I18nProvider from "@/providers/I18nProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  useInitializeLanguage();
  useInitializeTheme();

  return (
    <I18nProvider>
      <Head>
        <title>Cash Flow</title>
        <meta name="description" content="Track your personal finances easily." />
        <link rel="icon" href="/logo.png" />
      </Head>
      <TopBar />
      <Component {...pageProps} />
      <Footer />
      <GoTop />
    </I18nProvider>
  );
}
