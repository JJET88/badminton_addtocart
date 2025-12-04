import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all vouchers
export async function GET() {
  const db = mysqlPool
  const [rows] = await db.query(`SELECT * FROM vouchers;`);
  return NextResponse.json(rows);
}

// POST create voucher
export async function POST(request) {
  try {
    const body = await request.json();
    const { code, type, amount, minTotal, expiresAt } = body;

    const db = mysqlPool
    const [result] = await db.query(
      `INSERT INTO vouchers (code, type, amount, minTotal, expiresAt)
       VALUES (?, ?, ?, ?, ?)`,
      [code, type, amount, minTotal, expiresAt]
    );

    const [rows] = await db.query(`SELECT * FROM vouchers WHERE id = ?`, [
      result.insertId,
    ]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
