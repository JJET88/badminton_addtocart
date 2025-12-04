// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import bcrypt from "bcryptjs";

// GET user by ID
export async function GET(_req, { params }) {
  try {
    const { id } = await params; // Added await

    const [rows] = await mysqlPool.query(
      `SELECT id, name, email, role,points, created_at FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { name, email, role, password } = await req.json();

    const [exists] = await mysqlPool.query(
      `SELECT id, password, role FROM users WHERE id = ?`, // Added role to SELECT
      [id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let hashedPassword = exists[0].password;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Use existing role if not provided
    const updatedRole = role || exists[0].role;

    await mysqlPool.query(
      `UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?`,
      [name, email, updatedRole, hashedPassword, id]
    );

    const [rows] = await mysqlPool.query(
      `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params; // Added await

    const [exists] = await mysqlPool.query(
      `SELECT id FROM users WHERE id = ?`,
      [id]
    );
    if (exists.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await mysqlPool.query(`DELETE FROM users WHERE id = ?`, [id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}