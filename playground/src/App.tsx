import { useEffect, useMemo, useState } from "react";

import { createUsers } from "./data/users";
import { ExternalTableExample } from "./examples/external-table-example";
import { InternalTableExample } from "./examples/internal-table-example";
import { type Lang, labels } from "./lib/i18n";

export function App() {
  const data = useMemo(() => createUsers(), []);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{labels[lang].heading}</h1>
          <p className="text-muted-foreground text-sm">{labels[lang].subheading}</p>
        </div>
        <button
          type="button"
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setLang((prev) => (prev === "en" ? "ar" : "en"))}
        >
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">{labels[lang].internalHeading}</h2>
          <p className="text-muted-foreground text-sm">{labels[lang].internalSubheading}</p>
        </div>
        <InternalTableExample lang={lang} data={data} />
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">{labels[lang].externalHeading}</h2>
          <p className="text-muted-foreground text-sm">{labels[lang].externalSubheading}</p>
        </div>
        <ExternalTableExample lang={lang} />
      </section>
    </main>
  );
}
