import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  Check,
  CirclePlay,
  MessageCircle,
  Sparkles,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import { LeadCaptureModalTrigger } from "@/components/lead-capture-trigger";
import { ProductTourTrigger } from "@/components/site/product-tour-trigger";
import { siteButtonClasses } from "@/components/site/site-button";
import { siteContainerClasses } from "@/components/site/site-container";
import { primaryKeywords } from "@/lib/site-content";

const heroHighlights = [
  ["250K+", "Learners managed"],
  ["18K+", "Courses delivered"],
  ["₹12Cr+", "Course sales tracked"],
  ["99.9%", "Workspace uptime"],
];

type HomeHeroProps = {
  leadsEndpoint: string;
};

export function HomeHero({ leadsEndpoint }: HomeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fffdf8] pb-12 pt-[8.25rem] text-slate-950 dark:bg-[#0d1918] sm:pt-[9.5rem] lg:pb-16 lg:pt-[10rem]">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_84%_24%,rgba(103,232,190,0.28),transparent_25rem),radial-gradient(circle_at_63%_62%,rgba(125,211,252,0.22),transparent_25rem),radial-gradient(circle_at_8%_74%,rgba(251,191,36,0.10),transparent_20rem),linear-gradient(180deg,#fffdf8_0%,#f8fffc_55%,#f5fbff_100%)] dark:bg-[radial-gradient(circle_at_80%_25%,rgba(75,210,148,0.16),transparent_25rem),radial-gradient(circle_at_20%_70%,rgba(56,189,248,0.09),transparent_22rem),linear-gradient(180deg,#0d1918_0%,#0b1719_100%)]" />
      <div className="pointer-events-none absolute left-[7%] top-[32%] -z-10 size-2 rounded-full bg-[#ff9a79] shadow-[28px_60px_0_#7dd3fc,65px_-45px_0_#6ee7b7,120px_22px_0_#fcd34d] opacity-70" />

      <div
        className={siteContainerClasses({
          className:
            "relative grid items-center gap-7 sm:gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:gap-10 2xl:grid-cols-[0.86fr_1.14fr]",
        })}
      >
        <div className="max-w-3xl text-left sm:mx-auto sm:text-center xl:mx-0 xl:text-left">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-900/10 bg-white/80 py-1.5 pl-2 pr-3.5 text-[0.68rem] font-bold uppercase tracking-[0.17em] text-[#147b69] shadow-[0_12px_35px_-22px_rgba(20,123,105,0.6)] backdrop-blur dark:border-white/10 dark:bg-white/[0.06] dark:text-emerald-200 sm:text-xs">
            <span className="grid size-6 place-items-center rounded-full bg-[#dff8ed] text-[#147b69] dark:bg-emerald-300/15 dark:text-emerald-200">
              <Sparkles className="size-3" aria-hidden="true" />
            </span>
            White label LMS software
          </div>

          <h1 className="mt-5 max-w-[48rem] font-heading text-[2.3rem] font-semibold leading-[1.06] tracking-[-0.042em] text-[#132f2b] sm:mx-auto sm:mt-6 sm:text-[3.35rem] lg:text-[3.75rem] xl:mx-0 xl:text-[3.6rem] 2xl:text-[4.05rem] dark:text-white">
            Create your own{" "}
            <span className="bg-gradient-to-r from-[#167eaa] via-[#188f83] to-[#49a764] bg-clip-text text-transparent">
              online course platform
            </span>{" "}
            with KASA.
          </h1>

          <p className="mt-4 max-w-[42rem] text-[0.95rem] leading-7 text-slate-600 sm:mx-auto sm:mt-5 sm:text-lg sm:leading-8 xl:mx-0 dark:text-slate-300">
            Sell online courses, run live classes, manage students, collect
            payments, and issue certificates from one branded LMS platform.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:justify-center xl:justify-start">
            <LeadCaptureModalTrigger
              endpoint={leadsEndpoint}
              source="home-hero-enquiry"
              leadType="enquiry"
              buttonLabel="Talk to sales"
              modalTitle="Tell us about your academy"
              modalEyebrow="Website enquiry"
              icon={<MessageCircle className="size-4" aria-hidden="true" />}
              buttonClassName={siteButtonClasses({
                size: "sm",
                className:
                  "h-12 rounded-full !bg-[linear-gradient(90deg,#177ea6,#1f9a78)] px-6 shadow-[0_18px_38px_-20px_rgba(23,126,166,0.8)] hover:!bg-[linear-gradient(90deg,#126b90,#188466)]",
              })}
            />
            <ProductTourTrigger
              label="Take a Product Tour"
              variant="outline"
              size="sm"
              className="h-12 rounded-full !border-emerald-900/15 !bg-white/75 !text-[#176b68] px-6 backdrop-blur hover:!bg-[#eefbf6] dark:!border-white/15 dark:!bg-white/[0.04] dark:!text-white"
            />
          </div>

          <div className="mt-5 flex max-w-2xl flex-wrap justify-start gap-x-4 gap-y-2 sm:mx-auto sm:mt-6 sm:justify-center sm:gap-x-5 xl:mx-0 xl:justify-start">
            {primaryKeywords.slice(0, 3).map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                <span className="grid size-4 place-items-center rounded-full bg-[#dff8ed] text-[#147b69] dark:bg-emerald-300/15 dark:text-emerald-200">
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto h-[27.5rem] w-full max-w-[49rem] sm:h-[36rem] lg:h-[38rem] xl:h-[35.5rem] xl:max-w-none 2xl:h-[39rem]">
          <div className="absolute inset-x-0 bottom-2 top-[7%] overflow-hidden rounded-[38%_38%_2rem_2rem] bg-[linear-gradient(145deg,#dff8ed_0%,#dff7ff_55%,#fff0df_100%)] shadow-[0_35px_80px_-45px_rgba(20,123,105,0.35)] dark:bg-[linear-gradient(145deg,#17332c_0%,#17343a_55%,#30281f_100%)] sm:bottom-4 sm:left-[4%] sm:right-[2%] sm:top-[8%] sm:rounded-[46%_48%_2.5rem_2.5rem]">
            <div className="absolute -left-12 top-8 size-72 rounded-full border border-[#54bca8]/20" />
            <div className="absolute -left-2 top-20 size-80 rounded-full border border-[#54bca8]/15" />
            <div className="absolute bottom-10 right-12 h-28 w-28 rounded-full bg-[#ffb38f]/25 blur-2xl" />
          </div>

          <div className="absolute left-[3%] top-[7%] z-30 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-3 py-2 text-[0.68rem] font-bold text-[#147b69] shadow-lg shadow-emerald-900/10 backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-emerald-200 sm:left-[6%] sm:top-[9%] sm:px-4 sm:text-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Your academy is live
          </div>

          <div className="absolute bottom-2 left-[-8%] z-20 h-[76%] w-[61%] sm:bottom-4 sm:left-0 sm:h-[88%] sm:w-[64%] xl:left-[-3%] xl:w-[67%] 2xl:left-[1%] 2xl:w-[62%]">
            <Image
              src="/cwk-banner-01-900.webp"
              alt="Learner using KASA academy platform"
              fill
              preload
              sizes="(min-width: 1536px) 33rem, (min-width: 1280px) 30rem, (min-width: 640px) 29rem, 78vw"
              className="object-contain object-bottom"
            />
          </div>

          <div className="absolute right-[2%] top-[3%] z-30 w-[59%] overflow-hidden rounded-[1.35rem] border border-[#d9ebe5] bg-white/95 p-3 shadow-[0_30px_75px_-32px_rgba(30,97,87,0.48)] backdrop-blur sm:right-[1%] sm:top-[4%] sm:w-[54%] sm:rounded-[2rem] sm:p-5 2xl:right-[2%] 2xl:top-[7%]">
            <div className="flex items-center justify-between border-b border-[#e4eee9] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-xl bg-[#e6f7f1] text-[#147b69]">
                  <BookOpenCheck className="size-4" />
                </span>
                <div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[#147b69]">
                    Academy desk
                  </div>
                  <div className="text-xs font-semibold text-[#173b35] sm:text-sm">
                    Today at KASA
                  </div>
                </div>
              </div>
              <span className="hidden rounded-full bg-[#fff0df] px-2.5 py-1 text-[0.6rem] font-bold text-[#b75d32] sm:inline-flex">
                LIVE
              </span>
            </div>

            <div className="mt-3 rounded-2xl bg-[#f2fbf8] p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.13em] text-[#147b69]">
                  Next live class
                </span>
                <CirclePlay className="size-4 text-[#188f83]" />
              </div>
              <div className="mt-2 text-xs font-semibold text-[#173b35] sm:text-base">
                Physics · Current Electricity
              </div>
              <div className="mt-1 text-[0.6rem] text-slate-500 sm:text-xs">
                Batch A · 64 learners · Dr. Mehta
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-[#2aa5c0] to-[#42b883]" />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-[#e4eee9] p-2.5">
                <div className="text-[0.58rem] text-slate-500">Course sales</div>
                <div className="mt-1 text-sm font-bold text-[#173b35] sm:text-lg">₹4.8L</div>
              </div>
              <div className="rounded-xl border border-[#e4eee9] p-2.5">
                <div className="text-[0.58rem] text-slate-500">Completion</div>
                <div className="mt-1 text-sm font-bold text-[#173b35] sm:text-lg">86%</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fff0df] px-3 py-2.5 text-[#8d4a2d]">
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-[#dd7446]" />
                <span className="text-[0.65rem] font-semibold sm:text-xs">Certificates ready</span>
              </div>
              <ArrowUpRight className="size-3.5 text-[#b75d32]" />
            </div>
          </div>

          <div className="absolute bottom-[5%] right-[3%] z-30 flex items-center gap-2 rounded-xl border border-white bg-[#ff9a79] px-2.5 py-2 text-white shadow-[0_20px_45px_-24px_rgba(183,93,50,0.75)] sm:bottom-[7%] sm:right-[4%] sm:gap-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
            <span className="grid size-8 place-items-center rounded-xl bg-white/20">
              <TrendingUp className="size-4" />
            </span>
            <div>
              <div className="text-[0.58rem] font-medium text-white/80">This month</div>
              <div className="text-xs font-bold sm:text-sm">Growth +24%</div>
            </div>
          </div>

          <div className="absolute bottom-[4%] left-[6%] z-30 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/82 px-3.5 py-2.5 text-[#176b68] shadow-lg backdrop-blur sm:flex dark:border-white/10 dark:bg-white/10 dark:text-emerald-100">
            <UsersRound className="size-4" />
            <span className="text-xs font-bold">250K+ learners</span>
          </div>
        </div>
      </div>

      <div className={siteContainerClasses({ className: "relative mt-8 sm:mt-10" })}>
        <div className="grid overflow-hidden rounded-[1.45rem] border border-emerald-900/10 bg-white/75 shadow-[0_24px_55px_-38px_rgba(20,123,105,0.4)] backdrop-blur sm:grid-cols-4 dark:border-white/10 dark:bg-white/[0.05]">
          {heroHighlights.map(([value, label], index) => (
            <div
              key={value}
              className={[
                "flex items-center justify-between gap-3 px-5 py-4 sm:block sm:border-r sm:px-6 sm:text-center sm:last:border-r-0",
                index < heroHighlights.length - 1
                  ? "border-b border-emerald-900/10 sm:border-b-0 dark:border-white/10"
                  : "",
              ].join(" ")}
            >
              <span className="font-heading text-xl font-semibold text-[#188f83] sm:block sm:text-2xl dark:text-emerald-300">
                {value}
              </span>
              <span className="text-xs font-medium text-slate-500 sm:mt-1 sm:block dark:text-slate-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
