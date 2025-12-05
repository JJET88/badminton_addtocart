import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET single product
export async function GET(req, { params }) {
  try {
    // ✅ FIX: Await params in Next.js 15+
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    
    console.log("GET /api/products/[id] - ID:", id, "Type:", typeof id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const [rows] = await mysqlPool.query("SELECT * FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req, { params }) {
  try {
    // ✅ FIX: Await params in Next.js 15+
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);
    const body = await req.json();

    console.log("📝 PUT /api/products/[id] called:", {
      id,
      idType: typeof id,
      rawId: resolvedParams.id,
      body
    });

    if (isNaN(id)) {
      console.error("❌ Invalid ID - parseInt failed:", resolvedParams.id);
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    // Get current product
    const [currentProduct] = await mysqlPool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    console.log("📦 Current product from DB:", currentProduct[0]);

    if (currentProduct.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Build dynamic SQL
    const fields = [];
    const values = [];

    // Allow any field except id
    Object.entries(body).forEach(([key, val]) => {
      if (key !== 'id' && val !== undefined) {
        fields.push(`${key} = ?`);
        values.push(val);
        console.log(`  ✓ Adding field: ${key} = ${val} (type: ${typeof val})`);
      }
    });

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    console.log("🔧 Executing SQL:", sql);
    console.log("🔧 With values:", values);

    const [result] = await mysqlPool.query(sql, values);
    console.log("✅ Update result:", result);

    const [updated] = await mysqlPool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    console.log("✅ Updated product:", updated[0]);

    if (body.stock !== undefined) {
      console.log(`📦 Stock Update Complete - Product ${id}: ${currentProduct[0].stock} → ${updated[0].stock}`);
    }

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("❌ PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  try {
    // ✅ FIX: Await params in Next.js 15+
    const resolvedParams = await Promise.resolve(params);
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await mysqlPool.query("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE /api/products/[id] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}