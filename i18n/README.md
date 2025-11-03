# Internationalization (i18n) Setup

This project uses [next-intl](https://next-intl-docs.vercel.app/) for internationalization.

## Supported Languages

- English (en) - Default
- Spanish (es)
- German (de)
- Italian (it)

## File Structure

```
i18n/
  ├── config.ts         # Locale configuration
  ├── request.ts        # Next-intl request configuration
  └── README.md         # This file

messages/
  ├── en.json          # English translations
  ├── es.json          # Spanish translations
  ├── de.json          # German translations
  └── it.json          # Italian translations

hooks/
  └── use-translations.ts  # Translation hooks for client components

lib/
  └── i18n.ts          # Server-side locale utilities
```

## Usage

### In Client Components

Use the provided hooks:

```tsx
"use client";

import { useTranslations } from "@/hooks/use-translations";

export function MyComponent() {
  const t = useTranslations("common");

  return (
    <button>{t("save")}</button>
  );
}
```

Or use namespace-specific hooks:

```tsx
import { useAuthTranslations } from "@/hooks/use-translations";

export function LoginForm() {
  const t = useAuthTranslations();

  return (
    <h1>{t("welcomeBack")}</h1>
  );
}
```

### In Server Components

Import directly from next-intl:

```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("dashboard");

  return (
    <h1>{t("title")}</h1>
  );
}
```

### Language Switcher

Add the `LanguageSwitcher` component to your UI:

```tsx
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLocale } from "@/lib/i18n";

export default async function Header() {
  const locale = await getLocale();

  return (
    <header>
      <LanguageSwitcher currentLocale={locale} />
    </header>
  );
}
```

## Available Translation Namespaces

- **common**: Common UI elements (save, cancel, delete, etc.)
- **auth**: Authentication-related text
- **navigation**: Navigation menu items
- **dashboard**: Dashboard-specific text
- **workspace**: Workspace management
- **team**: Team and member management
- **profile**: User profile settings
- **errors**: Error messages
- **success**: Success messages

## Adding New Translations

1. Add the key to all language files (`messages/*.json`)
2. Use the translation in your component:

```tsx
const t = useTranslations("yourNamespace");
t("yourKey");
```

## Adding a New Language

1. Add the locale to `i18n/config.ts`:
```ts
export const locales = ["en", "es", "de", "it", "fr"] as const;

export const localeNames: Record<Locale, string> = {
  // ...
  fr: "Français",
};
```

2. Create a new translation file `messages/fr.json`
3. Copy the structure from `messages/en.json` and translate

## Translation File Structure

Each translation file follows this structure:

```json
{
  "namespace": {
    "key": "Translation value",
    "nestedKey": {
      "subKey": "Nested translation"
    }
  }
}
```

Example:

```json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  },
  "auth": {
    "login": "Sign In",
    "signup": "Sign Up"
  }
}
```

## Dynamic Values

Use variables in translations:

In translation file:
```json
{
  "workspace": {
    "typeToConfirm": "Type {name} to confirm"
  }
}
```

In component:
```tsx
t("typeToConfirm", { name: workspaceName })
```

## Best Practices

1. **Always provide all language versions** when adding new translations
2. **Use semantic keys** (e.g., `auth.welcomeBack` instead of `welcomeBackText`)
3. **Group related translations** in namespaces
4. **Keep translations short and concise**
5. **Test in all languages** before deploying
6. **Use variables** for dynamic content instead of string concatenation

## Current Locale Detection

The locale is stored in a cookie (`NEXT_LOCALE`) and persists across sessions. If no cookie is set, the default locale (English) is used.

## Server Actions

To get or set the locale on the server:

```ts
import { getLocale, setLocale } from "@/lib/i18n";

// Get current locale
const locale = await getLocale();

// Set locale
await setLocale("es");
```
