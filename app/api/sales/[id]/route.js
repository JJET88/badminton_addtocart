import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET sale by ID
export async function GET(_req, { params }) {
  try {
    const { id } = await params; // Add await
    const db = mysqlPool.promise();

    const [rows] = await db.query(`SELECT * FROM sales WHERE id = ?`, [id]);
    if (rows.length === 0)
      return NextResponse.json({ message: "Sale not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT update sale
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Add await
    const { total, subtotal, tax, paymentType, voucherCode, cashierId } =
      await request.json();

    const db = mysqlPool.promise();

    const [exists] = await db.query(`SELECT id FROM sales WHERE id = ?`, [id]);
    if (exists.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    await db.query(
      `UPDATE sales
       SET total=?, subtotal=?, tax=?, paymentType=?, voucherCode=?, cashierId=?
       WHERE id=?`,
      [total, subtotal, tax, paymentType, voucherCode, cashierId, id]
    );

    const [rows] = await db.query(`SELECT * FROM sales WHERE id = ?`, [id]);
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE sale
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params; // Add await
    const db = mysqlPool.promise();

    const [exists] = await db.query(`SELECT id FROM sales WHERE id = ?`, [id]);
    if (exists.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    await db.query(`DELETE FROM sales WHERE id = ?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}