import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { v2 as cloudinary } from "cloudinary";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

// No need to disable body parser when using req.formData()
// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET endpoint to retrieve accepted donations (for testing)
export async function GET(req: NextRequest) {
  await connectToDatabase();
  try {
    const donations = await Donation.find({ status: "accepted" });
    return NextResponse.json(donations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST endpoint to create a new donation request
export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    // Use NextRequest's built-in formData parser
    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const location = formData.get("location")?.toString() || "";
    const urgency = formData.get("urgency")?.toString() || "low";

    let fileUrl = "";
    const fileField = formData.get("proofDocument");
    if (fileField && fileField instanceof File) {
      // Convert the File blob to a Buffer
      const arrayBuffer = await fileField.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload file buffer to Cloudinary using upload_stream
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "donations" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
      fileUrl = uploadResult.secure_url;
    }

    const donation = await Donation.create({
      title,
      description,
      category,
      location,
      urgency,
      fileUrl,
      status: "pending",
    });

    return NextResponse.json(donation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
