import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Issue from "@/models/Issue";
import Vote from "@/models/Vote";
import { auth } from "@/lib/auth";

// Get a single issue with vote count
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const issue = await Issue.findById(params.id).populate(
      "createdBy",
      "name email"
    );

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Get vote count
    const voteCount = await Vote.countDocuments({ issue: issue._id });

    // Check if current user has voted (if authenticated)
    let userHasVoted = false;
    const session = await auth();

    if (session?.user?.id) {
      const vote = await Vote.findOne({
        issue: issue._id,
        user: session.user.id,
      });
      userHasVoted = !!vote;
    }

    return NextResponse.json({
      id: issue._id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: issue.location,
      imageUrl: issue.imageUrl,
      status: issue.status,
      createdBy: issue.createdBy,
      createdAt: issue.createdAt,
      votes: voteCount,
      userHasVoted,
    });
  } catch (error: any) {
    console.error("Get issue error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Update an issue
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const issue = await Issue.findById(params.id);

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Check if user is the creator of the issue
    if (issue.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to update this issue" },
        { status: 403 }
      );
    }

    // Check if issue is still in Pending status
    if (issue.status !== "Pending") {
      return NextResponse.json(
        { error: "Cannot update issue that is not in Pending status" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      category,
      location,
      imageUrl,
      latitude,
      longitude,
      status,
    } = await request.json();

    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.category = category || issue.category;
    issue.location = location || issue.location;
    issue.imageUrl = imageUrl || issue.imageUrl;
    issue.latitude = latitude || issue.latitude;
    issue.longitude = longitude || issue.longitude;
    issue.status = status || issue.status;

    await issue.save();

    return NextResponse.json(issue);
  } catch (error: any) {
    console.error("Update issue error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// Delete an issue
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const issue = await Issue.findById(params.id);

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Check if user is the creator of the issue
    if (issue.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this issue" },
        { status: 403 }
      );
    }

    // Check if issue is still in Pending status
    if (issue.status !== "Pending") {
      return NextResponse.json(
        { error: "Cannot delete issue that is not in Pending status" },
        { status: 400 }
      );
    }

    // Delete all votes for this issue
    await Vote.deleteMany({ issue: issue._id });

    // Delete the issue
    await issue.deleteOne();

    return NextResponse.json({ message: "Issue deleted successfully" });
  } catch (error: any) {
    console.error("Delete issue error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
