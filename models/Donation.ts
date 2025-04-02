import mongoose, { Schema, Document } from "mongoose";
import { Donation } from "@/types/donation";

interface DonationDocument extends Document, Donation {}

const DonationSchema = new Schema<DonationDocument>({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
  location: { type: String },
  urgency: { type: String, enum: ["low", "medium", "high"], default: "low" },
  fileUrl: { type: String },
 quantity: { type: Number},
  collection_date:{type: Date} , 
  status: { type: String, enum: ["pending", "accepted", "rejected","fullfiled",], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  userRole: { type: String, default: "user" },
  pick_up_location:{ type:String }
});

export default mongoose.models.Donation || mongoose.model<DonationDocument>("Donation", DonationSchema);
