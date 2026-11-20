import type { Metadata } from "next";
import { CalendarCheck, GraduationCap, HandCoins, Laptop, ShoppingBag, Store, UtensilsCrossed, Wrench } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import FinalCTA from "@/components/home/FinalCTA";
import { SpotlightCard } from "@/components/fx/Interactive";
import HorizontalRail from "@/components/fx/HorizontalRail";
import { SectionHeader } from "@/components/ui/Section";
import Scene from "@/components/three/Scene";

export const metadata: Metadata = { title: "Solutions" };

const cases = [
  { icon: ShoppingBag, title: "D2C online stores", body: "Hosted checkout or the JS SDK on your store. Fulfil on the signed payment.verified webhook.", tools: ["Checkout", "Webhooks", "API"] },
  { icon: GraduationCap, title: "Courses & coaching", body: "Unlock course access only after verification. Payment links for batch fees and workshops.", tools: ["Payment Links", "Webhooks"] },
  { icon: Store, title: "Retail counters", body: "A static QR at the counter and a paired phone that shows every incoming payment to staff.", tools: ["QR", "Merchant App"] },
  { icon: UtensilsCrossed, title: "Restaurants & cafés", body: "Per-table dynamic QR where supported, and instant alerts for the cashier.", tools: ["QR", "Instant Alerts"] },
  { icon: CalendarCheck, title: "Events & ticketing", body: "Single-use links per ticket with expiry. Late payments flagged, never silently accepted.", tools: ["Payment Links", "Reconciliation"] },
  { icon: Laptop, title: "Freelancers & agencies", body: "Send a link with each invoice and see the moment a client starts paying.", tools: ["Payment Links", "Instant Alerts"] },
  { icon: Wrench, title: "Home services", body: "Collect on-site with a QR on the technician's phone; office sees it in the dashboard.", tools: ["QR", "Dashboard"] },
  { icon: HandCoins, title: "Clubs & societies", body: "Monthly dues via reusable links and simple CSV exports for the treasurer.", tools: ["Payment Links", "Reports"] },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={"Built for how\nIndia gets paid."}
        accentWords={["india"]}
        description="From a single counter to a growing D2C brand, PayXa adapts to the way you already sell."
        scene="card"
      />
      <Scene shape="rings" side="center">
        <section className="pb-28">
          <HorizontalRail
            header={<SectionHeader eyebrow="Use cases" title="Pick your counter." accentWords={["counter."]} />}
            items={cases.map((c) => (
              <SpotlightCard key={c.title} className="group h-[340px] p-8">
                <span className="grid size-14 place-items-center rounded-2xl border border-crimson/30 bg-crimson/10 text-neon transition-transform duration-500 group-hover:rotate-6">
                  <c.icon size={24} />
                </span>
                <h2 className="mt-10 font-display text-lg font-semibold uppercase">{c.title}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {c.tools.map((t) => (
                    <span key={t} className="chip !py-1 !text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            ))}
          />
        </section>
      </Scene>
      <FinalCTA />
    </>
  );
}
