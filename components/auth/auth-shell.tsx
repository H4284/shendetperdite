import Link from "next/link";
import { t } from "@/lib/i18n/sq";

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
      {children}
    </div>
  );
}

export function AuthLinks({
  login,
  register,
}: {
  login?: boolean;
  register?: boolean;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      {register ? (
        <>
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-primary underline-offset-4 hover:underline">
            {t("auth.register")}
          </Link>
        </>
      ) : null}
      {login ? (
        <>
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            {t("auth.login")}
          </Link>
        </>
      ) : null}
    </p>
  );
}
