"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

function DonationForm({ category, request, onClose }) {
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
        status: "fulfilled",
      });
      toast.success("Donation submitted successfully!");
      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit donation");
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" placeholder="Describe your donation..." value={description} onChange={(e) => setDescription(e.target.value)} />
      <Label htmlFor="quantity">Quantity</Label>
      <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      <Label htmlFor="collection-date">Collection Date</Label>
      <Input id="collection-date" type="date" min={new Date().toISOString().split('T')[0]} value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} />
      <Label htmlFor="location">Pickup Location</Label>
      <Input id="location" placeholder="Enter address" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Button className="mt-4" onClick={handleSubmit}>Submit Donation</Button>
    </div>
  );
}

function RequestCard({ request, category }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="relative w-72 h-auto mx-auto">
      {request.image && (
        <div className="w-64 h-64 mx-auto overflow-hidden rounded-lg">
          <img src={request.image} alt="Request" className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader>
        <Badge variant="secondary" className="flex items-center gap-1">
          {request.type === "ngo" ? (
            <><Building2 className="h-3 w-3" /><span>NGO</span></>
          ) : (
            <><User className="h-3 w-3" /><span>Individual</span></>
          )}
        </Badge>
        <CardTitle className="text-center">{request.title}</CardTitle>
        <CardDescription className="text-center">{request.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground justify-center">
          <MapPin className="h-4 w-4 mr-2" />{request?.location}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full mt-4">Donate</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Make a Donation</DialogTitle>
            </DialogHeader>
            <DonationForm category={category} request={request} onClose={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default function DonationsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get("/api/donations");
        setRequests(response.data.filter(req => activeCategory === "all" || req.category === activeCategory));
      } catch (error) {
        toast.error("Failed to fetch donation requests");
      }
    }
    fetchRequests();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Donation Requests</h1>
      <div className="flex gap-4 justify-center mb-8">
        {["all", "food", "clothes", "books"].map(category => (
          <Button key={category} variant={activeCategory === category ? "default" : "outline"} onClick={() => setActiveCategory(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Donations
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
        {requests.map(request => (
          <RequestCard key={request._id} request={request} category={activeCategory} />
        ))}
      </div>
    </div>
  );
}