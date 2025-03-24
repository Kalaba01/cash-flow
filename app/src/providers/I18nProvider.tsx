"use client";
import { IntlProvider } from "next-intl";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguageStore();
  const [messages, setMessages] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    import(`@/locales/${locale}/global.json`)
      .then((data) => setMessages(data.default))
      .catch(() => setMessages(null));
  }, [locale]);

  if (!messages) return null;

  return <IntlProvider messages={messages} locale={locale}>{children}</IntlProvider>;
}
