"use server";

import User from "@/database/user.model";
import {
  clearSessionCookie,
  createSessionCookie,
  getSession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import connectDB from "@/lib/mongodb";

type AuthResult =
  | { success: true; user: { id: string; name: string; email: string } }
  | { success: false; error: string };

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function signupUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    await connectDB();

    const normalizedName = name.trim();
    const normalizedEmail = normalizeEmail(email);

    if (normalizedName.length < 2) {
      return { success: false, error: "Name must be at least 2 characters." };
    }

    if (password.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters.",
      };
    }

    const existingUser = await User.findOne({ email: normalizedEmail })
      .select("_id")
      .lean();

    if (existingUser) {
      return { success: false, error: "An account already exists for this email." };
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
    });

    await createSessionCookie({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Signup failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Signup failed.",
    };
  }
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  try {
    await connectDB();

    const user = await User.findOne({ email: normalizeEmail(email) });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return { success: false, error: "Invalid email or password." };
    }

    await createSessionCookie({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Login failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed.",
    };
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return {
    id: session.userId,
    name: session.name,
    email: session.email,
  };
}

export async function logoutUser() {
  await clearSessionCookie();

  return { success: true };
}
