import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import bcrypt from "bcryptjs";

// GET all users
export async function GET() {
  const [rows] = await mysqlPool.query(
    `SELECT id, name, email, role,points, created_at FROM users`
  );
  return NextResponse.json(rows);
}

// POST create user (REGISTER)
export async function POST(request) {
  try {
    const { name, email, role, password } = await request.json();

    // Check duplicate email
    const [existing] = await mysqlPool.query(
      `SELECT email FROM users WHERE email = ?`,
      [email]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert
    const [result] = await mysqlPool.query(
      `INSERT INTO users (name, email, role, password)
       VALUES (?, ?, ?, ?)`,
      [name, email, role, hashed]
    );

    const [rows] = await mysqlPool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
