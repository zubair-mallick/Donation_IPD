import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const donations = await Donation.find({ status: "pending" });
    if (!donations) return NextResponse.json({ message: "No pending donations found" }, { status: 404 });
    console.log(donations+"😡")
    return NextResponse.json(donations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
