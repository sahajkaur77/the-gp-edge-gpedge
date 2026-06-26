import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  let email = ''
  let name = ''
  let password = ''

  try {
    const body = await req.json()
    email = body.email
    name = body.name
    password = body.password

    console.log("[Register API] Request body received:", { 
      email, 
      name, 
      passwordLength: password ? password.length : 0 
    })
  } catch (jsonError: any) {
    console.error("[Register API] JSON parsing error:", jsonError)
    return NextResponse.json(
      { error: "Invalid JSON format in request body" },
      { status: 400 }
    )
  }

  // 1. Basic validation
  if (!email || !password || !name) {
    console.warn("[Register API] Validation error: Missing email, password or name")
    return NextResponse.json(
      { error: "Missing required fields (email, password, name)" },
      { status: 400 }
    )
  }

  // 2. Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.warn("[Register API] Validation error: Invalid email format:", email)
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    )
  }

  // 3. Password length check
  if (password.length < 6) {
    console.warn("[Register API] Validation error: Password too short")
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    )
  }

  // 4. Check existing user
  let existingUser = null
  try {
    console.log("[Register API] Querying user table for existing email:", email)
    existingUser = await db.user.findUnique({
      where: { email }
    })
  } catch (dbError: any) {
    console.error("[Register API] Database connection failed during email check:", dbError)
    return NextResponse.json(
      { error: "Database connection failed. Please ensure the database is running." },
      { status: 500 }
    )
  }

  if (existingUser) {
    console.warn("[Register API] Conflict: Email already exists:", email)
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    )
  }

  // 5. Hash password
  let hashedPassword = ""
  try {
    console.log("[Register API] Hashing password with bcrypt...")
    hashedPassword = await bcrypt.hash(password, 10)
  } catch (hashError: any) {
    console.error("[Register API] Password hashing failed:", hashError)
    return NextResponse.json(
      { error: "Password hashing failed." },
      { status: 500 }
    )
  }

  // 6. Create user in database with generated UUID
  let user = null
  try {
    const userId = `user_${crypto.randomBytes(12).toString('hex')}`
    console.log("[Register API] Attempting to create user with ID:", userId)
    user = await db.user.create({
      data: {
        id: userId,
        email,
        name,
        password_hash: hashedPassword,
        role: "USER"
      }
    })
  } catch (createError: any) {
    console.error("[Register API] User creation failed in database:", createError)
    return NextResponse.json(
      { error: "User creation failed." },
      { status: 500 }
    )
  }

  console.log("[Register API] Registration successful for user:", user.email)
  // Return the created user without the password hash
  return NextResponse.json(
    {
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    },
    { status: 201 }
  )
}
