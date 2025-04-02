import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const { id } = params;
    const { status } = await req.json() || "fullfiled";

    if (!["pending", "accepted", "rejected", "fulfilled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedDonation = await Donation.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedDonation) {
      return NextResponse.json({ error: "Donation not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDonation, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
