import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all sales
export async function GET() {
  const db = mysqlPool
  const [rows] = await db.query(`SELECT * FROM sales;`);
  return NextResponse.json(rows);
}

// POST create sale
export async function POST(request) {
  try {
    const body = await request.json();
    const { total, subtotal, tax, paymentType, voucherCode, cashierId } = body;

    const db = mysqlPool
    const [result] = await db.query(
      `INSERT INTO sales (total, subtotal, tax, paymentType, voucherCode, cashierId)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [total, subtotal, tax, paymentType, voucherCode, cashierId]
    );

    const [sale] = await db.query(`SELECT * FROM sales WHERE id = ?`, [
      result.insertId,
    ]);

    return NextResponse.json(sale[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
