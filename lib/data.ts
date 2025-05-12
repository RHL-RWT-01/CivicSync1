// Mock data 
export type IssueCategory =
  | "Road"
  | "Water"
  | "Sanitation"
  | "Electricity"
  | "Other";

export type IssueStatus = "Pending" | "In Progress" | "Resolved";

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  imageUrl?: string;
  status: IssueStatus;
  votes: number;
  createdAt: string;
  createdBy: string;
  userHasVoted?: boolean;
  latitude: number;
  longitude: number;
}

// Constants for Indore coordinates
const BASE_LAT = 22.7196;
const BASE_LNG = 75.8577;

const categories: IssueCategory[] = [
  "Road",
  "Water",
  "Sanitation",
  "Electricity",
  "Other",
];
const statuses: IssueStatus[] = ["Pending", "In Progress", "Resolved"];
const locations = [
  "Rajwada",
  "Vijay Nagar",
  "Palasia",
  "MG Road",
  "Indrapuri Colony",
  "Bhawarkuan",
  "Navlakha",
  "Chhoti Gwaltoli",
  "Airport Road",
  "Treasure Island Mall",
];

export const generateMockIssues = (count = 20): Issue[] => {
  const issues: Issue[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);

    const category = categories[Math.floor(Math.random() * categories.length)];
    const title = getRandomTitle(category);

    issues.push({
      id: `issue_${i + 1}`,
      title,
      description: getRandomDescription(category),
      category,
      location: locations[Math.floor(Math.random() * locations.length)],
      imageUrl:
        i % 3 === 0
          ? `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(
              title
            )}`
          : undefined,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      votes: Math.floor(Math.random() * 50),
      createdAt: date.toISOString(),
      createdBy: `user_${Math.floor(Math.random() * 10) + 1}`,
      userHasVoted: Math.random() > 0.7,
      latitude: BASE_LAT + (Math.random() - 0.5) * 0.1,
      longitude: BASE_LNG + (Math.random() - 0.5) * 0.1,
    });
  }

  return issues;
};

function getRandomTitle(category: IssueCategory): string {
  const titles = {
    Road: [
      "Pothole on Main Street",
      "Damaged sidewalk near school",
      "Missing street sign at intersection",
      "Road flooding after rain",
      "Broken traffic light",
    ],
    Water: [
      "Water main break",
      "Low water pressure in neighborhood",
      "Discolored tap water",
      "Leaking fire hydrant",
      "Sewage overflow",
    ],
    Sanitation: [
      "Overflowing public trash bin",
      "Missed garbage collection",
      "Illegal dumping site",
      "Recycling not collected",
      "Street cleaning needed",
    ],
    Electricity: [
      "Street light outage",
      "Downed power line",
      "Flickering street lights",
      "Exposed electrical wiring",
      "Power outage in neighborhood",
    ],
    Other: [
      "Graffiti on public building",
      "Abandoned vehicle",
      "Noise complaint",
      "Playground equipment damaged",
      "Public park maintenance needed",
    ],
  };
  return titles[category][Math.floor(Math.random() * titles[category].length)];
}

function getRandomDescription(category: IssueCategory): string {
  const descriptions = {
    Road: [
      "Large pothole approximately 2 feet wide and 6 inches deep causing hazard to vehicles and cyclists.",
      "Cracked and uneven sidewalk creating a tripping hazard.",
      "Missing or damaged street sign creating navigation issues.",
      "Flooded road after rain making it impassable.",
      "Malfunctioning traffic light causing congestion.",
    ],
    Water: [
      "Water is leaking heavily from underground.",
      "Very low water pressure in taps.",
      "Tap water is discolored and has odor.",
      "Leaking hydrant causing puddles.",
      "Sewage backup on the street.",
    ],
    Sanitation: [
      "Public trash bin overflowing onto sidewalk.",
      "Garbage not collected for several days.",
      "Illegal dumping of furniture or waste.",
      "Recyclables not picked up as scheduled.",
      "Street requires cleaning due to litter.",
    ],
    Electricity: [
      "Street lights are not working at night.",
      "Power line is down, creating danger.",
      "Flickering lights in the area.",
      "Exposed electrical wires visible.",
      "Widespread power outage in area.",
    ],
    Other: [
      "Graffiti on public walls and property.",
      "Car appears abandoned with flat tires.",
      "Excessive noise outside legal hours.",
      "Playground equipment is broken.",
      "Park is dirty and poorly maintained.",
    ],
  };
  return descriptions[category][
    Math.floor(Math.random() * descriptions[category].length)
  ];
}

export const generateAnalyticsData = () => {
  const issuesByCategory = categories.map((category) => ({
    name: category,
    value: Math.floor(Math.random() * 50) + 10,
  }));

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10) + 1,
    };
  });

  const topVotedIssues = Array.from({ length: 5 }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    return {
      id: `issue_${i + 1}`,
      title: getRandomTitle(category),
      category,
      votes: Math.floor(Math.random() * 100) + 50,
    };
  }).sort((a, b) => b.votes - a.votes);

  return {
    issuesByCategory,
    last7Days,
    topVotedIssues,
    totalIssues: issuesByCategory.reduce((sum, item) => sum + item.value, 0),
    totalVotes: topVotedIssues.reduce((sum, item) => sum + item.votes, 0),
    openIssues: Math.floor(Math.random() * 30) + 20,
  };
};

export const generateMapData = () => generateMockIssues(15);

export const getUserIssues = (userId: string): Issue[] => {
  return generateMockIssues(30)
    .filter((issue) => issue.createdBy === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

export const getIssueById = (id: string): Issue | undefined => {
  return generateMockIssues(50).find((issue) => issue.id === id);
};
