"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Clock, MapPin, Search, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { IssueCategory, IssueStatus } from "../types/clientTypes"

interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  imageUrl?: string
  status: IssueStatus
  votes: number
  createdAt: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  userHasVoted?: boolean
  longitude?: number
  latitude?: number
}

export default function IssuesPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalIssues, setTotalIssues] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

  const api_url = process.env.NEXT_PUBLIC_SERVER_URL;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500) // 0.5 second delay

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch issues function
  const fetchIssues = useCallback(async (page: number = 1, loadMore: boolean = false) => {
    try {
      if (!api_url) {
        throw new Error("Server URL is not configured");
      }

      if (!loadMore) {
        setIsLoading(true)
        setError(null)
      } else {
        setIsFetchingNextPage(true)
      }

      const queryParams = new URLSearchParams()
      queryParams.append("page", page.toString())
      queryParams.append("limit", "9")

      if (debouncedSearchQuery) {
        queryParams.append("search", debouncedSearchQuery)
      }

      if (categoryFilter && categoryFilter !== "all") {
        queryParams.append("category", categoryFilter)
      }

      if (statusFilter && statusFilter !== "all") {
        queryParams.append("status", statusFilter)
      }

      queryParams.append("sort", sortBy)

      const response = await fetch(`${api_url}/issue/issues?${queryParams.toString()}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch issues`)
      }

      const data = await response.json()
      if (loadMore) {
        setIssues(prevIssues => [...prevIssues, ...data.issues])
      } else {
        setIssues(data.issues)
      }

      setTotalPages(data.totalPages)
      setTotalIssues(data.totalIssues)
      setCurrentPage(page)
      setHasNextPage(page < data.totalPages)

    } catch (error) {
      console.error("Error fetching issues:", error)

      // Handle different error types
      let errorMessage = "Failed to load issues. Please try again."
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection."
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      setError(new Error(errorMessage))

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsFetchingNextPage(false)
    }
  }, [api_url, debouncedSearchQuery, categoryFilter, statusFilter, sortBy, toast])

  // Fetch issues when filters change
  useEffect(() => {
    setCurrentPage(1)
    fetchIssues(1, false)
  }, [fetchIssues])

  // Load more function
  const fetchNextPage = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchIssues(currentPage + 1, true)
    }
  }

  // Status badge color mapping
  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500"
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-500"
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-500"
      default:
        return ""
    }
  }

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Public Issues</h1>
          <p className="text-muted-foreground mt-1">Browse and vote on reported civic issues in your community</p>
        </div>
        <Link href="/issues/new">
          <Button>Report New Issue</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <form className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description"
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </form>
        <Select
          value={categoryFilter}
          onValueChange={(value) => {
            setCategoryFilter(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Road">Road</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Sanitation">Sanitation</SelectItem>
            <SelectItem value="Electricity">Electricity</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="votes">Most Voted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Issues Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No issues found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <Card key={issue.id} className="overflow-hidden flex flex-col">
                {issue.imageUrl && (
                  <div className="aspect-video relative">
                    <Image src={issue.imageUrl || "/placeholder.svg"} alt={issue.title} fill className="object-cover" />
                  </div>
                )}
                <CardContent className={`p-4 flex-1 ${!issue.imageUrl ? "pt-6" : ""}`}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-semibold line-clamp-1">{issue.title}</h3>
                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{issue.category}</Badge>
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      {issue.votes} votes
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{issue.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                  </div>
                  <Link href={`/issues/${issue.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="min-w-32"
              >
                {isFetchingNextPage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Issues"
                )}
              </Button>
            </div>
          )}

          {/* Show total issues count */}
          {totalIssues > 0 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing {issues.length} of {totalIssues} issues
            </div>
          )}
        </>
      )}
    </div>
  )
}
