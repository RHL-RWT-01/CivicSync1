import { ShieldCheck } from "lucide-react"
import Link from "next/link"

const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Public Issues", href: "/issues" },
      { label: "Map View", href: "/map" },
      { label: "Analytics", href: "/analytics" },
      { label: "Report an Issue", href: "/issues/new" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth/login" },
      { label: "Create Account", href: "/auth/register" },
      { label: "My Issues", href: "/my-issues" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Built by Rahul Rawat", href: "https://rahulrawat.in", external: true },
      { label: "Source on GitHub", href: "https://github.com/RHL-RWT-01/CivicSync1", external: true },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="container px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-blue-600" />
              <span className="bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 bg-clip-text text-xl font-extrabold text-transparent">
                CivicSync
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A transparent, community-ranked platform to report civic issues, vote on
              priorities, and track them to resolution.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} CivicSync. All rights reserved.</span>
          <span>
            A portfolio project by{" "}
            <a
              href="https://rahulrawat.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              Rahul Rawat
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
