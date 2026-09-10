import { Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  shipping: Truck,
  quality: ShieldCheck,
  natural: Leaf,
  curated: Sparkles,
};

export function StoreBenefits({
  items,
}: {
  items: { id: string; title: string; body: string }[];
}) {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = ICONS[item.id] ?? Sparkles;
          return (
            <div key={item.id} className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
