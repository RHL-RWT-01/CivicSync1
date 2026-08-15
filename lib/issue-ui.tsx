import type { IssueCategory, IssueStatus } from "@/app/types/clientTypes"
import { Construction, Droplets, Trash2, Zap, CircleAlert, type LucideIcon } from "lucide-react"

export const statusStyles: Record<
  IssueStatus,
  { badge: string; dot: string; label: string }
> = {
  Pending: {
    badge:
      "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Pending",
  },
  "In Progress": {
    badge: "border-blue-500/25 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    label: "In Progress",
  },
  Resolved: {
    badge:
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    label: "Resolved",
  },
}

export const categoryMeta: Record<
  IssueCategory,
  { icon: LucideIcon; tint: string }
> = {
  Road: { icon: Construction, tint: "from-orange-500/25 to-amber-500/10 text-orange-500" },
  Water: { icon: Droplets, tint: "from-sky-500/25 to-cyan-500/10 text-sky-500" },
  Electricity: { icon: Zap, tint: "from-yellow-500/25 to-amber-500/10 text-yellow-500" },
  Sanitation: { icon: Trash2, tint: "from-emerald-500/25 to-green-500/10 text-emerald-500" },
  Other: { icon: CircleAlert, tint: "from-violet-500/25 to-purple-500/10 text-violet-500" },
}

export function categoryFallback(category: string) {
  return categoryMeta[category as IssueCategory] ?? categoryMeta.Other
}
export function statusFallback(status: string) {
  return statusStyles[status as IssueStatus] ?? statusStyles.Pending
}
