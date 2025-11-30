import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import bcrypt from "bcrypt";

// GET all users
export async function GET() {
  const db = mysqlPool.promise();
  const [rows] = await db.query(`SELECT id, name, email, role, createdAt FROM users`);
  return NextResponse.json(rows);
}

// POST create user (REGISTER)
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    const db = mysqlPool.promise();

    // Check duplicate email
    const [existing] = await db.query(`SELECT email FROM users WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Save user
    const [result] = await db.query(
      `INSERT INTO users (name, email, role, password)
       VALUES (?, ?, ?, ?)`,
      [name, email, role, hashed]
    );

    const [rows] = await db.query(
      `SELECT id, name, email, role, createdAt FROM users WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
