"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales, localeNames, type Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLocale?: string;
}

export function LanguageSwitcher({ currentLocale = "en" }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = async (locale: Locale) => {
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year

    // Refresh to apply new locale
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{localeNames[currentLocale as Locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className="gap-2"
          >
            <Check
              className={`h-4 w-4 ${
                currentLocale === locale ? "opacity-100" : "opacity-0"
              }`}
            />
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
