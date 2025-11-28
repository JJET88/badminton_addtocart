import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET voucher by ID
export async function GET(_req, { params }) {
  try {
    const { id } = await params; // Add await
    const db = mysqlPool.promise();

    const [rows] = await db.query(`SELECT * FROM vouchers WHERE id = ?`, [id]);
    if (rows.length === 0)
      return NextResponse.json({ message: "Voucher not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT update voucher
export async function PUT(request, { params }) {
  try {
    const { id } = await params; // Add await
    const { code, type, amount, minTotal, expiresAt } = await request.json();

    const db = mysqlPool.promise();
    const [exists] = await db.query(`SELECT id FROM vouchers WHERE id = ?`, [
      id,
    ]);

    if (exists.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    await db.query(
      `UPDATE vouchers 
       SET code=?, type=?, amount=?, minTotal=?, expiresAt=?
       WHERE id=?`,
      [code, type, amount, minTotal, expiresAt, id]
    );

    const [rows] = await db.query(`SELECT * FROM vouchers WHERE id = ?`, [id]);
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE voucher
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params; // Add await
    const db = mysqlPool.promise();

    const [exists] = await db.query(`SELECT id FROM vouchers WHERE id = ?`, [id]);
    if (exists.length === 0)
      return NextResponse.json({ message: "Not found" }, { status: 404 });

    await db.query(`DELETE FROM vouchers WHERE id = ?`, [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}