"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeNames, localeFlags, type Locale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

function LocaleLabel({ locale }: { locale: Locale }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-sm leading-none" aria-hidden="true">
        {localeFlags[locale]}
      </span>
      <span>{localeNames[locale]}</span>
    </span>
  );
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Select
      value={locale}
      onValueChange={(value) => router.replace(pathname, { locale: value as Locale })}
    >
      <SelectTrigger className="w-[140px] h-9 border border-border bg-white hover:border-brand-red/30">
        <LocaleLabel locale={locale} />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(localeNames) as Locale[]).map((loc) => (
          <SelectItem key={loc} value={loc}>
            <LocaleLabel locale={loc} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
