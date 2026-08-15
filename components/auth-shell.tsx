import { CheckCircle2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

const points = [
  "Report issues with a location pin and photo",
  "Upvote what matters so it gets fixed first",
  "Track every report from pending to resolved",
]

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(150deg, #1d4ed8, #06b6d4)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-20"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 80% 60% at 30% 20%, #000, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 30% 20%, #000, transparent)",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2 text-white">
          <ShieldCheck className="h-8 w-8" />
          <span className="text-2xl font-extrabold">CivicSync</span>
        </Link>

        <div className="relative text-white">
          <h2 className="max-w-sm text-3xl font-bold leading-tight">
            Turn everyday complaints into real, tracked change.
          </h2>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/70">
          A portfolio project by Rahul Rawat
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-xl font-extrabold text-transparent">
                CivicSync
              </span>
            </Link>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
