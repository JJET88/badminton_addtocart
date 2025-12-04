import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET all products
export async function GET() {
  const promisePool = mysqlPool
  const [rows] = await promisePool.query(`SELECT * FROM products;`);
  return NextResponse.json(rows);
}

// POST create product
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, price, stock, category, image } = body;

    const promisePool = mysqlPool
    const [result] = await promisePool.query(
      `INSERT INTO products (title, price, stock, category, image)
       VALUES (?, ?, ?, ?, ?)`,
      [title, price, stock, category, image]
    );

    const [rows] = await promisePool.query(
      `SELECT * FROM products WHERE id = ?`,
      [result.insertId]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
