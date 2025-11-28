import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET user by ID
export async function GET(_req, { params }) {
  const { id } = params;
  const db = mysqlPool.promise();

  const [rows] = await db.query(
    `SELECT id, name, email, role, createdAt FROM users WHERE id = ?`,
    [id]
  );

  if (rows.length === 0)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(rows[0]);
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { name, email, role, password } = await request.json();

    const db = mysqlPool.promise();
    const [exists] = await db.query(`SELECT id FROM users WHERE id = ?`, [id]);

    if (exists.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    await db.query(
      `UPDATE users 
       SET name=?, email=?, role=?, password=?
       WHERE id=?`,
      [name, email, role, password, id]
    );

    const [rows] = await db.query(
      `SELECT id, name, email, role, createdAt FROM users WHERE id = ?`,
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(_req, { params }) {
  const { id } = params;
  const db = mysqlPool.promise();

  const [exists] = await db.query(`SELECT id FROM users WHERE id = ?`, [id]);
  if (exists.length === 0)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  await db.query(`DELETE FROM users WHERE id = ?`, [id]);

  return NextResponse.json({ ok: true });
}
