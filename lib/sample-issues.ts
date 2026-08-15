import type { IssueCategory, IssueStatus } from "@/app/types/clientTypes"

export interface SampleIssue {
  id: string
  title: string
  description: string
  category: IssueCategory
  location: string
  imageUrl?: string
  status: IssueStatus
  votes: number
  createdAt: string
  createdBy: { id: string; name: string; email: string }
  userHasVoted?: boolean
  longitude?: number
  latitude?: number
}

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString()

// Realistic demo issues shown when the live backend is unreachable, so the
// project always looks alive for portfolio visitors. Clearly flagged as sample.
export const sampleIssues: SampleIssue[] = [
  {
    id: "sample-1",
    title: "Large pothole near MG Road junction",
    description:
      "A deep pothole has formed at the busy MG Road signal. It's already caused two two-wheeler skids this week and gets worse after rain.",
    category: "Road",
    location: "MG Road, Sector 14",
    status: "In Progress",
    votes: 128,
    createdAt: daysAgo(2),
    createdBy: { id: "u1", name: "Aarti Sharma", email: "aarti@example.com" },
    latitude: 28.4595,
    longitude: 77.0266,
  },
  {
    id: "sample-2",
    title: "Streetlight out for two weeks on 5th Cross",
    description:
      "The entire stretch near the park has been dark since the last storm. Residents avoid the road after 8pm — a real safety concern for women and elders.",
    category: "Electricity",
    location: "5th Cross, Indiranagar",
    status: "Pending",
    votes: 74,
    createdAt: daysAgo(5),
    createdBy: { id: "u2", name: "Rohit Menon", email: "rohit@example.com" },
    latitude: 12.9719,
    longitude: 77.6412,
  },
  {
    id: "sample-3",
    title: "Overflowing garbage bins at the market",
    description:
      "Bins outside the vegetable market haven't been cleared in days. The smell and stray animals are becoming a health hazard for vendors and shoppers.",
    category: "Sanitation",
    location: "KR Market",
    status: "In Progress",
    votes: 96,
    createdAt: daysAgo(3),
    createdBy: { id: "u3", name: "Priya Nair", email: "priya@example.com" },
    latitude: 12.9611,
    longitude: 77.5775,
  },
  {
    id: "sample-4",
    title: "Water leakage flooding the footpath",
    description:
      "A burst pipeline is wasting hundreds of litres daily and has made the footpath impossible to walk on. Reported to the ward office with photos.",
    category: "Water",
    location: "80 Feet Road, Koramangala",
    status: "Resolved",
    votes: 152,
    createdAt: daysAgo(9),
    createdBy: { id: "u4", name: "Sameer Khan", email: "sameer@example.com" },
    latitude: 12.9352,
    longitude: 77.6245,
  },
  {
    id: "sample-5",
    title: "Broken drainage cover — open manhole",
    description:
      "The drain cover near the bus stop is missing, leaving an open hole on a crowded footpath. Someone will get seriously hurt if it isn't fixed soon.",
    category: "Sanitation",
    location: "ITPL Main Road, Whitefield",
    status: "Pending",
    votes: 61,
    createdAt: daysAgo(1),
    createdBy: { id: "u5", name: "Neha Gupta", email: "neha@example.com" },
    latitude: 12.9698,
    longitude: 77.7499,
  },
  {
    id: "sample-6",
    title: "Faded zebra crossing outside the school",
    description:
      "The pedestrian crossing near the primary school has completely worn off. With no markings, morning drop-off has become dangerous for children.",
    category: "Road",
    location: "4th Block, Jayanagar",
    status: "Resolved",
    votes: 88,
    createdAt: daysAgo(12),
    createdBy: { id: "u6", name: "Vikram Rao", email: "vikram@example.com" },
    latitude: 12.925,
    longitude: 77.5938,
  },
]
