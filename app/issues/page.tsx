"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IssueCard } from "@/components/issue-card"
import { sampleIssues } from "@/lib/sample-issues"
import { Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Demo dataset — the app renders entirely client-side so it always looks
  // complete, independent of backend availability.
  const issues = useMemo(() => {
    let list = [...sampleIssues]
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      )
    }
    if (categoryFilter !== "all") list = list.filter((i) => i.category === categoryFilter)
    if (statusFilter !== "all") list = list.filter((i) => i.status === statusFilter)
    list.sort((a, b) =>
      sortBy === "votes"
        ? b.votes - a.votes
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    return list
  }, [searchQuery, categoryFilter, statusFilter, sortBy])

  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setSortBy("newest")
  }

  const resolvedCount = sampleIssues.filter((i) => i.status === "Resolved").length
  const totalVotes = sampleIssues.reduce((s, i) => s + i.votes, 0)

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Community feed
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Public issues</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Browse what your neighbourhood is reporting, and upvote the problems that need
            attention first.
          </p>
        </div>
        <Link href="/issues/new">
          <Button size="lg" className="h-11 shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" /> Report an issue
          </Button>
        </Link>
      </div>

      {/* Stat strip */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {[
          { label: "Issues", value: sampleIssues.length },
          { label: "Resolved", value: resolvedCount },
          { label: "Total votes", value: totalVotes },
        ].map((s) => (
          <div key={s.label} className="px-5 py-4 text-center">
            <div className="text-2xl font-bold tabular-nums">{s.value}</div>
            <div className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-3 md:p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues by title or description…"
              className="h-11 pl-9"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Road">Road</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Sanitation">Sanitation</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-11">
                <SlidersHorizontal className="mr-1 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="votes">Most voted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">No issues match your filters</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try a different search term or clear the filters to see everything.
            </p>
            <Button variant="outline" className="mt-6" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Showing {issues.length} of {sampleIssues.length} issues
            </p>
          </>
        )}
      </div>
    </div>
  )
}
