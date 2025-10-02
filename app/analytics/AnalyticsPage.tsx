"use client"

import { BarChart, DonutChart, LineChart } from "@/components/charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { BarChart2, CheckCircle, ListTodo, PieChart, ThumbsUp, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface AnalyticsData {
  issuesByCategory: { name: string; value: number }[]
  last7Days: { date: string; count: number }[]
  topVotedIssues: { id: string; title: string; category: string; votes: number }[]
  totalIssues: number
  totalVotes: number
  openIssues: number
}

export default function AnalyticsPage() {
  const { toast } = useToast()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const api_url = process.env.NEXT_PUBLIC_SERVER_URL
  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${api_url}/issue/analytics`)

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data")
      }

      const analyticsData = await response.json()
      setData(analyticsData)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Civic Issue Analytics</h1>
        <p className="text-muted-foreground mt-1">Visualize and analyze civic issue data and trends</p>
      </div>

      {loading ? (
        <>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-4 w-28" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="w-full h-full bg-muted/30 rounded-md flex items-center justify-center">
                  <BarChart2 className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="w-full h-full bg-muted/30 rounded-md flex items-center justify-center">
                  <BarChart2 className="h-16 w-16 text-muted" />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center">
              <div className="w-full h-full bg-muted/30 rounded-md flex items-center justify-center">
                <BarChart2 className="h-16 w-16 text-muted" />
              </div>
            </CardContent>
          </Card>
        </>
      ) : data ? (
        <>
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="shadow-lg border-l-4 border-l-blue-500 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-foreground/80">Total Issues</CardTitle>
                <div className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-full">
                  <ListTodo className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-blue-600 tracking-tight">{data.totalIssues}</div>
                <p className="text-sm font-medium text-foreground/70 mt-1">Across all categories</p>
                <div className="mt-2 w-full bg-blue-100 dark:bg-blue-950/30 rounded-full h-1">
                  <div className="bg-blue-600 h-1 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-l-4 border-l-green-500 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-foreground/80">Total Votes</CardTitle>
                <div className="p-2 bg-green-100 dark:bg-green-950/30 rounded-full">
                  <ThumbsUp className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-green-600 tracking-tight">{data.totalVotes}</div>
                <p className="text-sm font-medium text-foreground/70 mt-1">Community engagement</p>
                <div className="mt-2 w-full bg-green-100 dark:bg-green-950/30 rounded-full h-1">
                  <div className="bg-green-600 h-1 rounded-full w-full"></div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg border-l-4 border-l-orange-500 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-foreground/80">Open Reports</CardTitle>
                <div className="p-2 bg-orange-100 dark:bg-orange-950/30 rounded-full">
                  <CheckCircle className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-orange-600 tracking-tight">{data.openIssues}</div>
                <p className="text-sm font-medium text-foreground/70 mt-1">Pending and in progress</p>
                <div className="mt-2 w-full bg-orange-100 dark:bg-orange-950/30 rounded-full h-1">
                  <div
                    className="bg-orange-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${(data.openIssues / data.totalIssues) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted/50">
              <TabsTrigger value="overview" className="h-10 text-sm font-semibold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                <BarChart2 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="categories" className="h-10 text-sm font-semibold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                <PieChart className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="trends" className="h-10 text-sm font-semibold tracking-wide data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="md:col-span-2 lg:col-span-1 shadow-lg border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-primary tracking-tight">Issues by Category</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Distribution of reported issues across categories</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 p-6">
                    <DonutChart data={data.issuesByCategory} />
                  </CardContent>
                </Card>
                <Card className="md:col-span-2 shadow-lg border-l-4 border-l-blue-500">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-blue-600 tracking-tight">Daily Issue Reports</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Reporting activity over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80 p-6">
                    <LineChart data={data.last7Days} />
                  </CardContent>
                </Card>
              </div>
              <Card className="shadow-lg border-l-4 border-l-green-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-green-600 tracking-tight">Most Voted Issues</CardTitle>
                  <CardDescription className="text-sm font-medium text-foreground/70">Top issues ranked by community engagement</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <BarChart data={data.topVotedIssues} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="categories" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-primary tracking-tight">Category Breakdown</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Visual distribution of issues by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-96 p-6">
                    <DonutChart data={data.issuesByCategory} />
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold text-primary tracking-tight">Category Statistics</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Detailed breakdown with percentages</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {data.issuesByCategory.map((category) => {
                        const total = data.issuesByCategory.reduce((sum, item) => sum + item.value, 0)
                        const percentage = ((category.value / total) * 100).toFixed(1)
                        return (
                          <div key={category.name} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-sm text-foreground">{category.name}</span>
                              <div className="text-right">
                                <span className="font-bold text-xl text-foreground">{category.value}</span>
                                <span className="text-foreground/60 text-sm font-medium ml-2">({percentage}%)</span>
                              </div>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${category.name === 'Road' ? 'bg-orange-500' :
                                  category.name === 'Water' ? 'bg-blue-500' :
                                    category.name === 'Sanitation' ? 'bg-green-500' :
                                      category.name === 'Electricity' ? 'bg-purple-500' :
                                        'bg-slate-500'
                                  }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">Total Issues</span>
                        <span className="text-3xl font-extrabold text-primary tracking-tight">
                          {data.issuesByCategory.reduce((sum, item) => sum + item.value, 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="trends" className="space-y-6">
              <Card className="shadow-lg border-l-4 border-l-purple-500">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-purple-600 tracking-tight">Reporting Trends</CardTitle>
                  <CardDescription className="text-sm font-medium text-foreground/70">Issue reporting patterns and trends over time</CardDescription>
                </CardHeader>
                <CardContent className="h-96 p-6">
                  <LineChart data={data.last7Days} />
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold tracking-tight">Weekly Summary</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Key metrics from the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border">
                        <span className="font-semibold text-foreground">Total Reports</span>
                        <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                          {data.last7Days.reduce((sum, day) => sum + day.count, 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border">
                        <span className="font-semibold text-foreground">Daily Average</span>
                        <span className="text-3xl font-extrabold text-green-600 tracking-tight">
                          {(data.last7Days.reduce((sum, day) => sum + day.count, 0) / 7).toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border">
                        <span className="font-semibold text-foreground">Peak Day</span>
                        <span className="text-xl font-bold text-orange-600 tracking-tight">
                          {data.last7Days.reduce((max, day) => day.count > max.count ? day : max, data.last7Days[0])?.date || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold tracking-tight">Trend Analysis</CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">Insights and patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {data.last7Days.length > 1 && (
                        <>
                          <div className="p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Trend Direction</span>
                              <div className="flex items-center gap-2">
                                {data.last7Days[data.last7Days.length - 1].count > data.last7Days[0].count ? (
                                  <>
                                    <span className="text-green-600 font-bold text-lg tracking-wide">↗ Increasing</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-red-600 font-bold text-lg tracking-wide">↘ Decreasing</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="p-3 border rounded-lg bg-background/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Most Active Day</span>
                              <span className="font-bold text-lg text-foreground">
                                {data.last7Days.reduce((max, day) => day.count > max.count ? day : max, data.last7Days[0])?.count || 0} reports
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No data available</h3>
          <p className="text-muted-foreground mt-1">There was a problem loading the analytics data.</p>
        </div>
      )}
    </div>
  )
}
