import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all sale items
export async function GET() {
  const db = mysqlPool.promise();
  const [rows] = await db.query(`SELECT * FROM saleitems;`);
  return NextResponse.json(rows);
}

// POST add sale item
export async function POST(request) {
  try {
    const body = await request.json();
    const { saleId, productId, quantity, price } = body;

    const db = mysqlPool.promise();
    const [result] = await db.query(
      `INSERT INTO saleitems (saleId, productId, quantity, price)
       VALUES (?, ?, ?, ?)`,
      [saleId, productId, quantity, price]
    );

    const [rows] = await db.query(`SELECT * FROM saleitems WHERE id = ?`, [
      result.insertId,
    ]);

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
