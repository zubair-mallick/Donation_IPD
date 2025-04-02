import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const { id } = params;
    const { status } = await req.json();

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true });

    if (!donation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json(donation, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
