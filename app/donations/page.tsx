"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Gift, MapPin, Calendar, Building2, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const dummyRequests = {
  food: [
    {
      id: 1,
      title: "Urgent: Food Needed for Shelter",
      organization: "City Shelter",
      location: "Downtown Community Center",
      needs: "Non-perishable food items, canned goods",
      urgency: "High",
      type: "ngo",
    },
    {
      id: 2,
      title: "Monthly Food Drive",
      organization: "Food Bank",
      location: "North District",
      needs: "Rice, pasta, canned vegetables",
      urgency: "Medium",
      type: "ngo",
    },
    {
      id: 7,
      title: "Family in Need of Food Support",
      organization: "Sarah Johnson",
      location: "West Area",
      needs: "Basic groceries and baby food",
      urgency: "High",
      type: "individual",
    },
  ],
  clothes: [
    {
      id: 3,
      title: "Winter Clothing Drive",
      organization: "Homeless Support",
      location: "Central Station",
      needs: "Warm jackets, blankets, socks",
      urgency: "High",
      type: "ngo",
    },
    {
      id: 4,
      title: "Children's Clothing needed",
      organization: "Family Support Center",
      location: "East Side",
      needs: "Children's clothes ages 2-12",
      urgency: "Medium",
      type: "ngo",
    },
    {
      id: 8,
      title: "Single Parent Needs Children's Clothes",
      organization: "Michael Chen",
      location: "South District",
      needs: "Winter clothes for kids aged 5-7",
      urgency: "Medium",
      type: "individual",
    },
  ],
  books: [
    {
      id: 5,
      title: "School Books Collection",
      organization: "Education First",
      location: "Public Library",
      needs: "Textbooks, children's books",
      urgency: "Medium",
      type: "ngo",
    },
    {
      id: 6,
      title: "Library Restocking",
      organization: "Community Library",
      location: "South Branch",
      needs: "Fiction and non-fiction books",
      urgency: "Low",
      type: "ngo",
    },
    {
      id: 9,
      title: "Student Needs College Textbooks",
      organization: "Emily Martinez",
      location: "University Area",
      needs: "Engineering and Math textbooks",
      urgency: "Medium",
      type: "individual",
    },
  ],
};

function DonationForm({ category, request }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  if (!isSignedIn) {
    router.push("/login");
    return null;
  }

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder={`Describe what you're donating...`}
          className="min-h-[100px]"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          placeholder="Enter quantity"
          type="number"
          min="1"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="collection-date">Collection Date</Label>
        <Input
          id="collection-date"
          type="date"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Pickup Location</Label>
        <Input
          id="location"
          placeholder="Enter your address"
        />
      </div>
      <Button className="mt-4">Submit Donation</Button>
    </div>
  );
}

function RequestCard({ request, category }) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            {request.type === "ngo" ? (
              <>
                <Building2 className="h-3 w-3" />
                <span>NGO</span>
              </>
            ) : (
              <>
                <User className="h-3 w-3" />
                <span>Individual</span>
              </>
            )}
          </Badge>
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
            request.urgency === 'High' ? 'bg-red-100 text-red-800' :
            request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {request.urgency}
          </div>
        </div>
        <CardTitle className="text-lg">{request.title}</CardTitle>
        <CardDescription>{request.organization}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {request.location}
          </div>
          <p className="text-sm">{request.needs}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Donate</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
              <DialogDescription>
                You're donating to: {request.organization} ({request.type === "ngo" ? "NGO" : "Individual"})
              </DialogDescription>
            </DialogHeader>
            <DonationForm category={category} request={request} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function DonationsPage() {
  const [activeCategory, setActiveCategory] = useState("food");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Donation Requests</h1>
      
      <div className="flex gap-4 mb-8">
        <Button
          variant={activeCategory === "food" ? "default" : "outline"}
          onClick={() => setActiveCategory("food")}
        >
          Food Donations
        </Button>
        <Button
          variant={activeCategory === "clothes" ? "default" : "outline"}
          onClick={() => setActiveCategory("clothes")}
        >
          Clothing Donations
        </Button>
        <Button
          variant={activeCategory === "books" ? "default" : "outline"}
          onClick={() => setActiveCategory("books")}
        >
          Book Donations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyRequests[activeCategory].map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            category={activeCategory}
          />
        ))}
      </div>
    </div>
  );
}