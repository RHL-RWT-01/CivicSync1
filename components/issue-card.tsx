import { categoryFallback, statusFallback } from "@/lib/issue-ui"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpRight, Clock, MapPin, ThumbsUp } from "lucide-react"
import Link from "next/link"

export interface IssueCardData {
  id: string
  title: string
  description: string
  category: string
  location: string
  imageUrl?: string
  status: string
  votes: number
  createdAt: string
  userHasVoted?: boolean
}

export function IssueCard({ issue }: { issue: IssueCardData }) {
  const cat = categoryFallback(issue.category)
  const st = statusFallback(issue.status)
  const CatIcon = cat.icon

  let ago = ""
  try {
    ago = formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })
  } catch {
    ago = "recently"
  }

  return (
    <Link
      href={`/issues/${issue.id}`}
      className="hover-ring group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    >
      {/* Media */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {issue.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${cat.tint}`}>
            <CatIcon className="h-12 w-12 opacity-80" />
          </div>
        )}
        {/* status pill */}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur ${st.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
        {/* category chip */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
          <CatIcon className="h-3.5 w-3.5" />
          {issue.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-semibold leading-snug transition-colors group-hover:text-primary">
          {issue.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{issue.location}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {issue.description}
        </p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border/70 pt-4">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-semibold ${
                issue.userHasVoted
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary ring-1 ring-primary/20"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              {issue.votes}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {ago}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-all group-hover:opacity-100">
            View
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
