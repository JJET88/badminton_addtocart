import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    return NextResponse.json({ user: decoded });
  } catch (err) {
    console.error("ME API ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
