import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET single product
export async function GET(req, { params }) {
  try {
    const id = params.id;
    const db = mysqlPool.promise();

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update product (partial update supported)
export async function PUT(req, { params }) {
  try {
    const id = params.id;
    const body = await req.json();
    const db = mysqlPool.promise();

    // Build dynamic SQL
    const fields = [];
    const values = [];

    Object.entries(body).forEach(([key, val]) => {
      fields.push(`${key} = ?`);
      values.push(val);
    });

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(id); // for WHERE id = ?

    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    await db.query(sql, values);

    const [updated] = await db.query("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    return NextResponse.json(updated[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    const db = mysqlPool.promise();

    await db.query("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
