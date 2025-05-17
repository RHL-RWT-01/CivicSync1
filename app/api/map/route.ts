import { NextResponse } from "next/server";
import Issue from "@/models/Issue"; // Mongoose model
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const issues = await Issue.find().sort({ createdAt: -1 });

    return NextResponse.json(issues, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
