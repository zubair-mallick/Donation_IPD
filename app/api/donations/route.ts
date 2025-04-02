import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch all donations
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const donations = await Donation.find({status: 'accepted'});
    return NextResponse.json(donations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new donation request
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const urgency = formData.get("urgency")?.toString() || "low";

    let fileUrl = "";
    let imageUrl = "";

    // Upload Proof Document (Optional)
    const proofFile = formData.get("proofDocument");
    if (proofFile && proofFile instanceof File) {
      const buffer = Buffer.from(await proofFile.arrayBuffer());
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "donations" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(buffer);
      });
      fileUrl = uploadResult.secure_url;
    }

    // Upload Image (Optional)
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "donation_images" },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        ).end(buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const donation = await Donation.create({
      title,
      description,
      category,
      location,
      urgency,
      fileUrl,
      image: imageUrl || "no image available",
      status: "pending",
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
