import { useTranslations as useNextIntlTranslations } from "next-intl";

/**
 * Hook to use translations in client components
 * @param namespace - The translation namespace (e.g., 'common', 'auth', 'dashboard')
 */
export function useTranslations(namespace?: string) {
  return useNextIntlTranslations(namespace);
}

/**
 * Convenience hooks for specific namespaces
 */
export const useCommonTranslations = () => useTranslations("common");
export const useAuthTranslations = () => useTranslations("auth");
export const useNavigationTranslations = () => useTranslations("navigation");
export const useDashboardTranslations = () => useTranslations("dashboard");
export const useWorkspaceTranslations = () => useTranslations("workspace");
export const useTeamTranslations = () => useTranslations("team");
export const useProfileTranslations = () => useTranslations("profile");
export const useErrorTranslations = () => useTranslations("errors");
export const useSuccessTranslations = () => useTranslations("success");
