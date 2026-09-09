"use client";

import { useRouter } from "next/navigation";
import { siteConfig } from "@/config/site";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { t } from "@/lib/i18n/sq";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const items = siteConfig.nav.flatMap((item) => [
    ...(item.hasLanding ? [{ name: item.name, slug: item.slug }] : []),
    ...item.children,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-1/3 translate-y-0 overflow-hidden p-0 sm:max-w-lg"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t("search.title")}</DialogTitle>
          <DialogDescription>{t("search.description")}</DialogDescription>
        </DialogHeader>
        <Command>
          <CommandInput placeholder={t("header.searchPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("search.empty")}</CommandEmpty>
            <CommandGroup heading={t("search.categories")}>
              {items.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={item.name}
                  onSelect={() => {
                    onOpenChange(false);
                    router.push(`/categories/${item.slug}`);
                  }}
                >
                  {item.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
