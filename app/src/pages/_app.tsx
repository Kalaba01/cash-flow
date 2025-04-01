import "@/styles/globals.scss";
import Head from "next/head";
import type { AppProps } from "next/app";
import { TopBar, Footer, GoTop } from "@/components";
import { useInitializeLanguage } from "@/store/useLanguageStore";
import { useInitializeTheme } from "@/store/useThemeStore";
import { NotificationContainer } from "@/components/Notification/Notification";
import I18nProvider from "@/providers/I18nProvider";

// Main application component that wraps all pages
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
      <div className="wrapper">
        
        <TopBar />
        <main className="content">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      <GoTop />
      <NotificationContainer />
    </I18nProvider>
  );
}
