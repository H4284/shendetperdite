"use client";

import { useEffect } from "react";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/lib/auth/use-user";
import { loadProfile, saveProfile } from "@/lib/account/data";
import {
  changePasswordSchema,
  profileSchema,
  type ProfileInput,
} from "@/lib/auth/schema";
import { authErrorMessage, firebaseErrorCode } from "@/lib/auth/errors";
import { t } from "@/lib/i18n/sq";

export default function ProfilePage() {
  const { user, ready } = useAuthUser();
  const profileForm = useForm<ProfileInput>({
    defaultValues: { displayName: "", phone: "", newsletterOptIn: false },
  });
  const passwordForm = useForm({
    defaultValues: { currentPassword: "", password: "", confirmPassword: "" },
  });
  const hasPassword = user?.providerData.some((provider) => provider.providerId === "password");

  useEffect(() => {
    if (!user) return;
    void loadProfile(user.uid).then((profile) => {
      profileForm.reset({
        displayName: profile.displayName || user.displayName || "",
        phone: profile.phone || "",
        newsletterOptIn: profile.newsletterOptIn,
      });
    });
  }, [user, profileForm]);

  async function onSaveProfile(values: ProfileInput) {
    if (!user) return;
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        profileForm.setError(issue.path.join(".") as keyof ProfileInput, {
          message: issue.message,
        });
      }
      return;
    }
    await saveProfile(user.uid, {
      email: user.email ?? "",
      ...parsed.data,
    });
    if (parsed.data.displayName !== user.displayName) {
      await updateProfile(user, { displayName: parsed.data.displayName });
    }
    if (parsed.data.newsletterOptIn) {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
    }
    toast.success(t("account.profileSaved"));
  }

  async function onChangePassword(values: {
    currentPassword: string;
    password: string;
    confirmPassword: string;
  }) {
    if (!user?.email) return;
    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        passwordForm.setError(
          issue.path.join(".") as "currentPassword" | "password" | "confirmPassword",
          { message: issue.message },
        );
      }
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, parsed.data.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, parsed.data.password);
      passwordForm.reset();
      toast.success(t("account.passwordSaved"));
    } catch (error) {
      toast.error(authErrorMessage(firebaseErrorCode(error)));
    }
  }

  if (!ready) return <p className="text-sm text-muted-foreground">{t("account.loading")}</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight">{t("account.profile")}</h1>
      <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4 rounded-2xl border p-5">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.email")}</span>
          <Input className="h-11" value={user?.email ?? ""} readOnly />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("auth.name")}</span>
          <Input className="h-11" {...profileForm.register("displayName")} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium">{t("checkout.phone")}</span>
          <Input className="h-11" {...profileForm.register("phone")} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={profileForm.watch("newsletterOptIn")}
            onCheckedChange={(checked) =>
              profileForm.setValue("newsletterOptIn", checked === true)
            }
          />
          {t("checkout.newsletter")}
        </label>
        <Button type="submit">{t("account.save")}</Button>
      </form>

      {hasPassword ? (
        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="space-y-4 rounded-2xl border p-5"
        >
          <h2 className="font-semibold">{t("account.changePassword")}</h2>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("account.currentPassword")}</span>
            <Input className="h-11" type="password" {...passwordForm.register("currentPassword")} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("auth.password")}</span>
            <Input className="h-11" type="password" {...passwordForm.register("password")} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">{t("auth.confirmPassword")}</span>
            <Input className="h-11" type="password" {...passwordForm.register("confirmPassword")} />
          </label>
          <Button type="submit">{t("account.savePassword")}</Button>
        </form>
      ) : null}
    </div>
  );
}
