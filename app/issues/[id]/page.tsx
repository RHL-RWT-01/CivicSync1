"use client"

import { IssueCategory, IssueStatus } from "@/app/types/clientTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import { sampleIssues } from "@/lib/sample-issues"
import { categoryFallback, statusFallback } from "@/lib/issue-ui"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Info, MapPin, ThumbsUp, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet"
import { toast } from "sonner"



interface Issue {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  imageUrl?: string
  status: IssueStatus
  createdAt: string
  longitude?: number
  latitude?: number
  createdBy: {
    id: string
    name: string
    email: string
  }
  votes: number
  userHasVoted: boolean
}

export default function IssueDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSample, setIsSample] = useState(false)
  const [voteLoading, setVoteLoading] = useState(false)
  const api_url = process.env.NEXT_PUBLIC_SERVER_URL
  useEffect(() => {
    if (params.id) fetchIssue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const loadSample = () => {
    const s = sampleIssues.find((i) => i.id === params.id) ?? sampleIssues[0]
    setIssue({ ...s, userHasVoted: false } as Issue)
    setIsSample(true)
  }

  const fetchIssue = async () => {
    setLoading(true)
    setIsSample(false)
    // Sample ids resolve straight from local demo data.
    if (typeof params.id === "string" && params.id.startsWith("sample-")) {
      loadSample()
      setLoading(false)
      return
    }
    try {
      const response = await fetch(`${api_url}/issue/${params.id}`)
      if (!response.ok) throw new Error("Failed to fetch issue")
      const data = await response.json()
      setIssue(data)
    } catch (error) {
      console.error("Error fetching issue:", error)
      // Graceful fallback so the page never dead-ends for portfolio visitors.
      loadSample()
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async () => {
    if (!user) {
      toast.error("Login to vote on issues.")
      router.push("/auth/login")
      return
    }

    if (!issue) return

    // Sample mode: toggle the vote locally (no backend).
    if (isSample) {
      setIssue((prev) =>
        prev
          ? {
              ...prev,
              userHasVoted: !prev.userHasVoted,
              votes: prev.votes + (prev.userHasVoted ? -1 : 1),
            }
          : prev
      )
      return
    }

    setVoteLoading(true)

    try {
      const response = await fetch(`${api_url}/issue/vote/${issue.id}`, {
        method: "POST",
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "An error occurred.")
        return
      }

      setIssue((prev) =>
        prev
          ? {
            ...prev,
            votes: data.votes,
            userHasVoted: data.userHasVoted,
          }
          : prev
      )

      toast.success(issue.userHasVoted ? "Vote removed" : "Vote recorded", {
        style: { background: "#1e293b", color: "#3b82f6" }, // bg-slate-800 + blue text
      })
    } catch (error) {
      console.error("Error voting:", error)
      toast.error("Failed to process your vote. Please try again.")
    } finally {
      setVoteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to issues
        </Button>
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-6" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (!issue) return null

  return (
    <div className="container py-8">
      <Link href="/issues">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to issues
        </Button>
      </Link>

      {isSample && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Sample issue.</span> The live server is asleep
            (free tier) — this is demo content showing how a report looks.
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight mb-4">{issue.title}</h1>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium">
          {(() => {
            const Icon = categoryFallback(issue.category).icon
            return <Icon className="h-3.5 w-3.5" />
          })()}
          {issue.category}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${statusFallback(issue.status).badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${statusFallback(issue.status).dot}`} />
          {issue.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {issue.imageUrl ? (
            <Image
              src={issue.imageUrl}
              alt={issue.title}
              width={700}
              height={300}
              className="w-full rounded-xl object-cover"
            />
          ) : (
            <div
              className={`flex aspect-[16/7] w-full items-center justify-center rounded-xl border border-border bg-gradient-to-br ${categoryFallback(issue.category).tint}`}
            >
              {(() => {
                const Icon = categoryFallback(issue.category).icon
                return <Icon className="h-16 w-16 opacity-80" />
              })()}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{issue.description}</p>
          </div>
        </div>

        <div className="space-y-6 h-full w-full">
          <Card className="border border-muted">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{issue.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Reported {format(new Date(issue.createdAt), "PPP")}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Reported by {issue.createdBy.name}</span>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleVote}
                  disabled={voteLoading}
                  className="w-full"
                  variant={issue.userHasVoted ? "outline" : "default"}
                >
                  <ThumbsUp className="mr-2 h-5 w-5" />
                  {issue.votes}
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Click again to {issue.userHasVoted ? "remove" : "cast"} your vote
                </p>
              </div>
            </CardContent>
          </Card>
          {issue.latitude && issue.longitude && (
            <div className="mt-6 h-[300px] w-full rounded-lg overflow-hidden border-muted border">
              <h2 className="text-xl font-semibold m-2 ml-2">Location on Map</h2>

              <MapContainer
                center={[issue.latitude, issue.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <CircleMarker
                  center={[issue.latitude, issue.longitude]}
                  radius={8}
                  pathOptions={{
                    color: "blue",
                    fillColor: "blue",
                    fillOpacity: 0.7,
                  }}
                >
                  <Popup>
                    <strong>{issue.title}</strong>
                    <br />
                    {issue.location}
                  </Popup>
                </CircleMarker>
              </MapContainer>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
