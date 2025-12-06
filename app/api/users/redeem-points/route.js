import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// POST - Redeem (deduct) points from user
export async function POST(req) {
  try {
    const { userId, pointsToRedeem } = await req.json();

    console.log('🎟️ POST /api/users/redeem-points called:', { userId, pointsToRedeem });

    // Validation
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (pointsToRedeem === undefined || pointsToRedeem === null) {
      return NextResponse.json(
        { error: "pointsToRedeem is required" },
        { status: 400 }
      );
    }

    if (typeof pointsToRedeem !== 'number' || isNaN(pointsToRedeem)) {
      return NextResponse.json(
        { error: "pointsToRedeem must be a valid number" },
        { status: 400 }
      );
    }

    if (pointsToRedeem <= 0) {
      return NextResponse.json(
        { error: "pointsToRedeem must be greater than 0" },
        { status: 400 }
      );
    }

    // Get current user
    const [rows] = await mysqlPool.query(
      "SELECT id, name, points FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const currentPoints = rows[0].points || 0;

    // Check if user has enough points
    if (currentPoints < pointsToRedeem) {
      return NextResponse.json(
        { 
          error: "Insufficient points",
          currentPoints,
          requestedPoints: pointsToRedeem,
          shortfall: pointsToRedeem - currentPoints
        },
        { status: 400 }
      );
    }

    const newPoints = currentPoints - pointsToRedeem;

    // Update user points
    await mysqlPool.query(
      "UPDATE users SET points = ? WHERE id = ?",
      [newPoints, userId]
    );

    console.log(`✅ Redeemed ${pointsToRedeem} points from ${rows[0].name}: ${currentPoints} → ${newPoints}`);

    return NextResponse.json({
      success: true,
      message: `Redeemed ${pointsToRedeem} points`,
      newPoints,
      previousPoints: currentPoints,
      pointsRedeemed: pointsToRedeem,
      userName: rows[0].name
    });

  } catch (err) {
    console.error("❌ POST /api/users/redeem-points error:", err);
    return NextResponse.json(
      { error: "Failed to redeem points", details: err.message },
      { status: 500 }
    );
  }
}