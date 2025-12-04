import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// Points redemption configuration
const POINTS_TO_DOLLAR_RATIO = 10; // 10 points = $1 discount

export async function POST(req) {
  try {
    const { userId, pointsToRedeem } = await req.json();

    if (!userId || !pointsToRedeem) {
      return NextResponse.json(
        { error: "userId and pointsToRedeem are required" },
        { status: 400 }
      );
    }

    if (pointsToRedeem <= 0) {
      return NextResponse.json(
        { error: "Points to redeem must be greater than 0" },
        { status: 400 }
      );
    }

    // Get current user points
    const [rows] = await mysqlPool.query(
      "SELECT points FROM users WHERE id = ?",
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
        { error: "Insufficient points", currentPoints },
        { status: 400 }
      );
    }

    // Calculate discount amount
    const discountAmount = pointsToRedeem / POINTS_TO_DOLLAR_RATIO;
    const newPoints = currentPoints - pointsToRedeem;

    // Update user points
    await mysqlPool.query(
      "UPDATE users SET points = ? WHERE id = ?",
      [newPoints, userId]
    );

    return NextResponse.json({
      success: true,
      message: `Redeemed ${pointsToRedeem} points for $${discountAmount.toFixed(2)} discount`,
      pointsRedeemed: pointsToRedeem,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      newPoints,
      previousPoints: currentPoints,
    });

  } catch (err) {
    console.error("REDEEM POINTS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to redeem points" },
      { status: 500 }
    );
  }
}

// GET endpoint to check points value
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const points = parseInt(searchParams.get("points")) || 0;

    const discountAmount = points / POINTS_TO_DOLLAR_RATIO;

    return NextResponse.json({
      points,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      ratio: POINTS_TO_DOLLAR_RATIO,
      message: `${POINTS_TO_DOLLAR_RATIO} points = $1 discount`,
    });

  } catch (err) {
    console.error("GET POINTS VALUE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to calculate points value" },
      { status: 500 }
    );
  }
}