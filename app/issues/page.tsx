"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { IssueCard, type IssueCardData } from "@/components/issue-card"
import { sampleIssues } from "@/lib/sample-issues"
import { Info, Plus, Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

export default function IssuesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const [issues, setIssues] = useState<IssueCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSample, setIsSample] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalIssues, setTotalIssues] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

  const api_url = process.env.NEXT_PUBLIC_SERVER_URL

  // Client-side filter/sort applied to the sample set when the backend is down.
  const applySample = useCallback(() => {
    let list = [...sampleIssues]
    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase()
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
    setIssues(list)
    setTotalIssues(list.length)
    setHasNextPage(false)
    setIsSample(true)
  }, [debouncedSearchQuery, categoryFilter, statusFilter, sortBy])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchIssues = useCallback(
    async (page: number = 1, loadMore: boolean = false) => {
      try {
        if (!api_url) throw new Error("Server URL is not configured")

        if (!loadMore) {
          setIsLoading(true)
          setIsSample(false)
        } else {
          setIsFetchingNextPage(true)
        }

        const queryParams = new URLSearchParams()
        queryParams.append("page", page.toString())
        queryParams.append("limit", "9")
        if (debouncedSearchQuery) queryParams.append("search", debouncedSearchQuery)
        if (categoryFilter !== "all") queryParams.append("category", categoryFilter)
        if (statusFilter !== "all") queryParams.append("status", statusFilter)
        queryParams.append("sort", sortBy)

        const response = await fetch(`${api_url}/issue/issues?${queryParams.toString()}`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        setIssues((prev) => (loadMore ? [...prev, ...data.issues] : data.issues))
        setTotalPages(data.totalPages)
        setTotalIssues(data.totalIssues)
        setCurrentPage(page)
        setHasNextPage(page < data.totalPages)
      } catch (error) {
        console.error("Error fetching issues:", error)
        // Graceful fallback: show sample data so the page never looks broken.
        applySample()
      } finally {
        setIsLoading(false)
        setIsFetchingNextPage(false)
      }
    },
    [api_url, debouncedSearchQuery, categoryFilter, statusFilter, sortBy, applySample]
  )

  useEffect(() => {
    setCurrentPage(1)
    fetchIssues(1, false)
  }, [fetchIssues])

  // Re-filter sample data live when filters change (no refetch needed).
  useEffect(() => {
    if (isSample) applySample()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, categoryFilter, statusFilter, sortBy])

  const fetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) fetchIssues(currentPage + 1, true)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setStatusFilter("all")
    setSortBy("newest")
  }

  const resolvedCount = issues.filter((i) => i.status === "Resolved").length
  const totalVotes = issues.reduce((s, i) => s + (i.votes || 0), 0)

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
          { label: "Issues", value: totalIssues || issues.length },
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

      {/* Sample-data notice */}
      {isSample && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Showing sample data.</span> The live server is on a
            free tier and is currently asleep — this is a preview of how the feed looks with real
            reports.
          </p>
        </div>
      )}

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
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                <Skeleton className="aspect-[16/9] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between pt-3">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
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

            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={fetchNextPage}
                  disabled={isFetchingNextPage}
                  className="min-w-40"
                >
                  {isFetchingNextPage ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent" />
                      Loading…
                    </>
                  ) : (
                    "Load more issues"
                  )}
                </Button>
              </div>
            )}

            {totalIssues > 0 && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Showing {issues.length} of {totalIssues} issues
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
