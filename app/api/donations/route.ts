import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { IncomingForm } from "formidable";
import fs from "fs";

// Disable body parser
export const config = { api: { bodyParser: false } };

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  await connectToDatabase();

  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });

    form.parse(req as any, async (err, fields, files) => {
      if (err) {
        return resolve(NextResponse.json({ error: "Error parsing form data" }, { status: 500 }));
      }
      try {
        let fileUrl = "";
        if (files.file) {
          const file = files.file as formidable.File;
          const uploadResponse = await cloudinary.uploader.upload(file.filepath, { folder: "donations" });
          fileUrl = uploadResponse.secure_url;
          fs.unlinkSync(file.filepath);
        }

        const donation = await Donation.create({
          title: fields.title,
          description: fields.description,
          category: fields.category,
          location: fields.location,
          urgency: fields.urgency,
          fileUrl,
          status: "pending",
        });

        return resolve(NextResponse.json(donation, { status: 201 }));
      } catch (error: any) {
        return resolve(NextResponse.json({ error: error.message }, { status: 500 }));
      }
    });
  });
}
