import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET /api/attractions
export async function GET() {
  const promisePool = mysqlPool.promise();
  const [rows] = await promisePool.query(`SELECT * FROM badminton;`);
  return NextResponse.json(rows);
}

// POST /api/attractions  -> Create
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, price, description, category, image, rating_rate, rating_count } = body;
    
    const promisePool = mysqlPool.promise();
    const [result] = await promisePool.query(
      `INSERT INTO tawbayin ( title, price, description, category, image, rating_rate, rating_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
       [title, price, description, category, image, rating_rate, rating_count]
    )

    const [rows] = await promisePool.query(
      `SELECT * FROM badminton WHERE id = ?`,
      [result.insertId]
    )
    return NextResponse.json(rows[0], { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    )
  }
}
