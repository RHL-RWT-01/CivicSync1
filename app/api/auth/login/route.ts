import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const { email, password } = await request.json()

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 })
  }
}
