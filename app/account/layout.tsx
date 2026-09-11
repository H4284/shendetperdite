import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { getSessionUser } from "@/lib/auth/server";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <AccountNav />
      <div>{children}</div>
    </div>
  );
}
