export type Issue = {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
    location: string;
    category: IssueCategory;
    createdAt: string;
    status: IssueStatus;
};
export type IssueStatus = "Pending" | "In Progress" | "Resolved"
export type IssueCategory = "Road" | "Water" | "Electricity" | "Sanitation" | "Other"
