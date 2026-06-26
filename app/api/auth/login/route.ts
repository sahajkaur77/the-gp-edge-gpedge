import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body

    console.log("[Login API Custom] Request received for email:", email)

    // 1. Validation
    if (!email || !password) {
      console.warn("[Login API Custom] Missing email or password")
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      )
    }

    // 2. Fetch user
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user || !user.password_hash) {
      console.warn("[Login API Custom] User not found or no password hash:", email)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordValid) {
      console.warn("[Login API Custom] Invalid password for email:", email)
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    console.log("[Login API Custom] Successful custom authentication for:", email)

    // Return the authenticated user profile upon successful credentials verification
    return NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("[Login API Custom] Error during authentication:", error)
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    )
  }
}
