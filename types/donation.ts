export interface Donation {
    _id?: string;
    title: string;
    description: string;
    category?: string;
    quantity?: number;
    collection_date?: string;
    location?: string;
    urgency: "low" | "medium" | "high";
    fileUrl?: string;
    status: "pending" | "accepted" | "rejected";
    createdAt?: Date;
    userRole?: "user" | "admin";
    pick_up_location?: string;
  }
  