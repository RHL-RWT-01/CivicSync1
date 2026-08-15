"use client"

import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"
import { useAuth } from "@/contexts/auth-context"
import {
  ArrowRight,
  BarChart3,
  Bell,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  Map as MapIcon,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react"
import Link from "next/link"

const categories = [
  "Potholes",
  "Streetlights",
  "Water supply",
  "Garbage & sanitation",
  "Drainage",
  "Road safety",
  "Parks",
  "Public transport",
  "Encroachment",
]

export default function Home() {
  const { user, loading } = useAuth()

  return (
    <div className="flex flex-col">
      {/* ───────────────────────────── Hero ───────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="civic-backdrop" aria-hidden />
        <div className="container relative px-4 md:px-6 pt-16 pb-14 md:pt-24 md:pb-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div>
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary civic-pulse" />
                  Civic issue reporting, done transparently
                </span>
              </Reveal>

              <Reveal delay={70}>
                <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-[1.05]">
                  Report it. Vote it up.
                  <br />
                  <span className="text-gradient-civic">Watch it get fixed.</span>
                </h1>
              </Reveal>

              <Reveal delay={130}>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  CivicSync turns scattered complaints into a transparent, community-ranked
                  queue — so the issues that matter most to your neighbourhood get resolved
                  first. Geo-tagged, photo-backed, and tracked to resolution.
                </p>
              </Reveal>

              <Reveal delay={190}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {loading ? (
                    <div className="h-11 w-40 animate-pulse rounded-md bg-muted" />
                  ) : user ? (
                    <>
                      <Link href="/issues">
                        <Button size="lg" className="h-11 px-6 shadow-lg shadow-primary/20">
                          Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/issues/new">
                        <Button size="lg" variant="outline" className="h-11 px-6">
                          <Camera className="mr-2 h-4 w-4" /> Report an issue
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/issues">
                        <Button size="lg" className="h-11 px-6 shadow-lg shadow-primary/20">
                          Browse issues <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button size="lg" variant="outline" className="h-11 px-6">
                          Join your community
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </Reveal>

              <Reveal delay={250}>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  {[
                    { icon: MapPin, label: "Pin-point location" },
                    { icon: ThumbsUp, label: "Community voting" },
                    { icon: CheckCircle2, label: "Live status tracking" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <Reveal delay={160} className="relative hidden lg:block">
              <HeroVisual />
            </Reveal>
          </div>
        </div>

        {/* Category marquee */}
        <div className="relative border-y border-border/70 bg-card/40 py-4">
          <div className="civic-marquee-mask overflow-hidden">
            <div className="civic-marquee-track">
              {[...categories, ...categories].map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground"
                >
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── How it works ─────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                How it works
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                From complaint to closure, in the open
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                No black box. Every issue moves through the same transparent path — and the
                whole community can see it happen.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Camera,
                step: "01",
                title: "Report with proof",
                body: "Drop a pin on the map, add a photo and a short description. Misfiled reports get auto-categorised so nothing slips through.",
              },
              {
                icon: ThumbsUp,
                step: "02",
                title: "The community prioritises",
                body: "Neighbours upvote the issues that hurt most. The queue ranks itself, so authorities always see what matters first.",
              },
              {
                icon: TrendingUp,
                step: "03",
                title: "Track to resolution",
                body: "Follow every status change from reported to in-progress to resolved — with a public timeline anyone can audit.",
              },
            ].map((s, i) => (
              <Reveal key={s.step} delay={i * 90}>
                <div className="hover-ring group relative h-full rounded-2xl border border-border bg-card p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <span className="text-3xl font-extrabold text-muted-foreground/25">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Features ─────────────────────────── */}
      <section className="border-t border-border bg-muted/40 py-20 md:py-28">
        <div className="container px-4 md:px-6">
          <Reveal>
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                Built for civic action
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Everything a neighbourhood needs to be heard
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: MapIcon, title: "Live issue map", body: "See every reported issue plotted around you, clustered by area and colour-coded by status." },
              { icon: ThumbsUp, title: "Priority voting", body: "One resident, one vote per issue. The loudest problems rise to the top, fairly." },
              { icon: BarChart3, title: "Analytics dashboard", body: "Trends by category, ward and status — so patterns and hotspots become obvious." },
              { icon: CheckCircle2, title: "Status tracking", body: "A clear lifecycle from reported to resolved, with a public audit trail." },
              { icon: Bell, title: "Stay in the loop", body: "Get notified the moment an issue you care about changes status." },
              { icon: ShieldCheck, title: "Accountable & open", body: "Nothing hidden. Reports, votes and outcomes are visible to the whole community." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 80}>
                <div className="hover-ring group h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CTA ─────────────────────────── */}
      {!user && !loading && (
        <section className="py-20 md:py-24">
          <div className="container px-4 md:px-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-16">
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}
                  aria-hidden
                />
                <div
                  className="absolute inset-0 opacity-20"
                  aria-hidden
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                    maskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, #000, transparent)",
                    WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 0%, #000, transparent)",
                  }}
                />
                <div className="relative mx-auto max-w-2xl text-white">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Your street. Your voice. Your move.
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-base text-white/85 md:text-lg">
                    Be part of the solution. Register now to start reporting and voting on the
                    issues that shape your neighbourhood.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/auth/register">
                      <Button
                        size="lg"
                        className="h-11 bg-white px-7 text-primary hover:bg-white/90"
                      >
                        Sign up free <Users className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/issues">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-11 border-white/40 bg-white/10 px-7 text-white hover:bg-white/20 hover:text-white"
                      >
                        Explore issues first
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  )
}

/* ───────────────────────── Hero visual (product mockup) ───────────────────────── */
function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-md">
      <div
        className="absolute -inset-6 -z-10 rounded-[2rem] opacity-60 blur-2xl"
        style={{ background: "radial-gradient(closest-side, rgba(37,99,235,.35), transparent)" }}
        aria-hidden
      />

      {/* Main issue card */}
      <div className="glass civic-float overflow-hidden rounded-2xl shadow-2xl">
        {/* photo banner */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 12px, transparent 12px 24px)",
            }}
            aria-hidden
          />
          <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <MapIcon className="h-3.5 w-3.5" /> Roads
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-semibold text-white">
            <Clock className="h-3.5 w-3.5" /> In progress
          </div>
          <Camera className="absolute bottom-4 right-4 h-5 w-5 text-white/60" />
        </div>

        {/* body */}
        <div className="p-5">
          <h3 className="text-base font-semibold leading-snug">
            Large pothole near MG Road junction
          </h3>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Sector 14
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 2 days ago
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary ring-1 ring-primary/20">
              <ThumbsUp className="h-4 w-4" /> 128
            </button>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="h-4 w-4" /> 24 comments
            </span>
          </div>
        </div>
      </div>

      {/* Floating "resolved" chip */}
      <div
        className="glass civic-float absolute -bottom-5 -left-6 flex items-center gap-2 rounded-xl px-3.5 py-2.5 shadow-xl"
        style={{ animationDelay: "1.5s" }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <div className="text-xs font-semibold">Streetlight fixed</div>
          <div className="text-[11px] text-muted-foreground">Resolved in 3 days</div>
        </div>
      </div>

      {/* Floating vote chip */}
      <div
        className="glass civic-float absolute -right-5 top-8 flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl"
        style={{ animationDelay: "0.8s" }}
      >
        <TrendingUp className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold">+42 votes today</span>
      </div>
    </div>
  )
}
