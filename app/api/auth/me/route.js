import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { mysqlPool } from "@/utils/db";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ user: null });
    }

    // Fetch fresh user data from database to get latest points
    const [rows] = await mysqlPool.query(
      "SELECT id, name, email, role, points FROM users WHERE id = ?",
      [decoded.id]
    );

    // If user not found in database
    if (rows.length === 0) {
      return NextResponse.json({ user: null });
    }

    const user = rows[0];

    // Return fresh user data with current points
    return NextResponse.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points ?? 0, // Ensure points default to 0
      }
    });

  } catch (err) {
    console.error("ME API ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}