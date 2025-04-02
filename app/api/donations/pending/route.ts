import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function GET(req: NextRequest,res: NextResponse){
  res.setHeader(
    "Cache-Control",
    "no-cache, no-store, max-age=0, must-revalidate"
  );
  await connectToDatabase();
  try {
    const donations = await Donation.find({ status: "pending" });
    if (!donations)
      return NextResponse.json(
        { message: "No pending donations found" },
        { status: 404 }
      );

    const response = NextResponse.json(donations, { status: 200 });

\
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
