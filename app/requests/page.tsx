"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Import toast

const requestCategories = {
  individual: ["food", "clothes", "books", "medical", "education"],
  ngo: ["food", "clothes", "books", "medical", "education", "infrastructure", "technology"]
};

function RequestForm({ role }: { role: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) return null;

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [urgency, setUrgency] = useState("low");
  const [proofDocument, setProofDocument] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("urgency", urgency);
    if (proofDocument) {
      formData.append("proofDocument", proofDocument);
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Request submitted successfully!");
        router.push("/requests");
      } else {
        toast.error("Failed to submit request.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {requestCategories[role].map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Request Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you need" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="urgency">Urgency Level</Label>
        <Select onValueChange={setUrgency} defaultValue="low">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {urgency === "high" && (
        <div className="grid gap-2">
          <Label htmlFor="proof">Supporting Document</Label>
          <Input
            id="proof"
            type="file"
            onChange={(e) => setProofDocument(e.target.files?.[0] || null)}
          />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="image">Upload Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading || (urgency === "high" && !proofDocument)}>
        {loading ? "Submitting..." : "Submit Request"}
      </Button>
    </div>
  );
}

export default function RequestsPage() {
  const [role, setRole] = useState("individual");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create Request</h1>
        <div className="flex gap-4">
          <Button variant={role === "individual" ? "default" : "outline"} onClick={() => setRole("individual")}>
            <User className="h-4 w-4" /> Individual
          </Button>
          <Button variant={role === "ngo" ? "default" : "outline"} onClick={() => setRole("ngo")}>
            <Building2 className="h-4 w-4" /> NGO
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm role={role} />
        </CardContent>
      </Card>
    </div>
  );
}