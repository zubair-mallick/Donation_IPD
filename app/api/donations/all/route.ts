import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    await connectToDatabase();
    try {
      const donations = await Donation.find({ });
      return NextResponse.json(donations, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  