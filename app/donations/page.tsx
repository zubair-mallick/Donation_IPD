"use client";

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
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

function DonationForm({ category, request }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [location, setLocation] = useState("");

  if (!isSignedIn) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async () => {
    try {
      await axios.patch(`/api/donations/${request._id}`, {
        category,
        description,
        quantity,
        collectionDate,
        location,
        status: "fullfiled", // Automatically set status to "accepted" when donating
      });
      alert("Donation submitted successfully!");
    } catch (error) {
      alert("Failed to submit donation");
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe what you're donating..." className="min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" placeholder="Enter quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="collection-date">Collection Date</Label>
        <Input id="collection-date" type="date" min={new Date().toISOString().split('T')[0]} value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="location">Pickup Location</Label>
        <Input id="location" placeholder="Enter your address" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <Button className="mt-4" onClick={handleSubmit}>Submit Donation</Button>
    </div>
  );
}

function RequestCard({ request, category }) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="flex items-center gap-1">
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
          <div className={`px-2 py-1 rounded-full text-xs font-semibold ${request.urgency === 'high' ? 'bg-red-100 text-red-800' : request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
          </div>
        </div>
        <CardTitle className="text-lg">{request.title}</CardTitle>
        <CardDescription>{request.description}</CardDescription>
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
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get("/api/donations");
        setRequests(response.data.filter((req) => req.category === activeCategory));
      } catch (error) {
        console.error("Failed to fetch donation requests", error);
      }
    }
    fetchRequests();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Donation Requests</h1>
      <div className="flex gap-4 mb-8">
        {["food", "clothes", "books"].map((category) => (
          <Button key={category} variant={activeCategory === category ? "default" : "outline"} onClick={() => setActiveCategory(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Donations
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((request) => (
          <RequestCard key={request._id} request={request} category={activeCategory} />
        ))}
      </div>
    </div>
  );
}
