import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { addPoints } = await req.json();

    if (!addPoints) {
      return NextResponse.json(
        { error: "Missing addPoints value" },
        { status: 400 }
      );
    }

    const db = mysqlPool.promise();

    // Check if user exists
    const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update points
    await db.query(
      `UPDATE users SET points = points + ? WHERE id = ?`,
      [addPoints, id]
    );

    // Return updated user
    const [updated] = await db.query(
      `SELECT id, username, email, points FROM users WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      message: "Points updated successfully",
      user: updated[0],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
