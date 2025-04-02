import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const donations = await Donation.find({ status: "pending" });
    if (!donations)
      return NextResponse.json(
        { message: "No pending donations found" },
        { status: 404 }
      );

    const response = NextResponse.json(donations, { status: 200 });

    // Disable caching
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
