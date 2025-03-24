import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { TopBar, Footer, GoTop } from "@/components";
import { useInitializeLanguage } from "@/store/useLanguageStore";
import I18nProvider from "@/providers/I18nProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  useInitializeLanguage();

  return (
    <I18nProvider>
      <TopBar />
      <Component {...pageProps} />
      <Footer />
      <GoTop />
    </I18nProvider>
  );
}
