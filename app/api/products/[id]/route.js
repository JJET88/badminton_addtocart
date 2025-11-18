import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET /api/attractions/:id
export async function GET(_request, { params }) {
  const { id } = params;
  const promisePool = mysqlPool.promise();

  const [rows] = await promisePool.query(
    `SELECT * FROM badminton WHERE id = ?;`,
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json(
      { message: `Product with id ${id} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(rows[0]);
}

// PUT /api/attractions/:id -> Update
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, price, description, category, image, rating_rate, rating_count } = body;

    const promisePool = mysqlPool.promise();

    const [exists] = await promisePool.query(
      `SELECT id FROM badminton WHERE id = ?`,
      [id]
    );

    if (exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await promisePool.query(
      `UPDATE badminton
       SET title = ?, price = ?, description = ?, category = ?, image = ?, rating_rate = ?, rating_count = ?
       WHERE id = ?`,
      [
        title ?? null,
        price ?? null,
        description ?? null,
        category ?? null,
        image ?? null,
        rating_rate ?? null,
        rating_count ?? null,
        id, // ❌ Important: id must be last for WHERE clause
      ]
    );

    const [rows] = await promisePool.query(
      `SELECT * FROM badminton WHERE id = ?`,
      [id]
    );

    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE /api/attractions/:id -> Delete
export async function DELETE(_request, { params }) {
  try {
    const { id } = params;
    const promisePool = mysqlPool.promise();

    const [exists] = await promisePool.query(
      `SELECT id FROM badminton WHERE id = ?`,
      [id]
    );

    if (exists.length === 0) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    await promisePool.query(`DELETE FROM badminton WHERE id = ?`, [id]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
