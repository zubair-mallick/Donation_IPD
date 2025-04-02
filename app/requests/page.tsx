"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Building2, User, Upload } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const requestCategories = {
  individual: ["food", "clothes", "books", "medical", "education"],
  ngo: ["food", "clothes", "books", "medical", "education", "infrastructure", "technology"]
};

const requestTypeInfo = {
  food: {
    title: "Food Assistance",
    description: "Request food supplies, groceries, or meal assistance",
    examples: "Groceries, Non-perishable items, Baby food"
  },
  clothes: {
    title: "Clothing Support",
    description: "Request clothing items for individuals or communities",
    examples: "Winter wear, Children's clothing, Professional attire"
  },
  books: {
    title: "Educational Materials",
    description: "Request books and educational resources",
    examples: "Textbooks, Children's books, Study materials"
  },
  medical: {
    title: "Medical Support",
    description: "Request medical supplies or assistance",
    examples: "First aid supplies, Over-the-counter medicines"
  },
  education: {
    title: "Educational Support",
    description: "Request educational assistance or resources",
    examples: "Tuition assistance, School supplies"
  },
  infrastructure: {
    title: "Infrastructure Support",
    description: "Request support for facility improvements",
    examples: "Building repairs, Equipment"
  },
  technology: {
    title: "Technology Resources",
    description: "Request technology and digital resources",
    examples: "Computers, Internet access"
  }
};

function RequestForm({ role }) {
   const { isSignedIn } = useAuth();
    const router = useRouter();
  
    if (!isSignedIn) {
      router.push("/login");
      return null;
    }
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("low");
  const [proofDocument, setProofDocument] = useState(null);

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
              <SelectItem key={cat} value={cat}>
                {requestTypeInfo[cat].title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {category && (
        <div className="grid gap-2">
          <Label>Category Information</Label>
          <div className="text-sm text-muted-foreground">
            <p>{requestTypeInfo[category].description}</p>
            <p className="mt-1">Examples: {requestTypeInfo[category].examples}</p>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="title">Request Title</Label>
        <Input id="title" placeholder="Enter a clear title for your request" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what you need and why..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="Enter your location"
        />
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
          <div className="border-2 border-dashed rounded-lg p-4 text-center">
            <Input
              id="proof"
              type="file"
              className="hidden"
              onChange={(e) => setProofDocument(e.target.files?.[0])}
            />
            <Label htmlFor="proof" className="cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Upload proof document (Required for high priority)
              </p>
              {proofDocument && (
                <p className="text-sm text-primary mt-2">
                  Selected: {proofDocument.name}
                </p>
              )}
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Please provide documentation to support your high-priority request
            (e.g., medical certificate, official letter)
          </p>
        </div>
      )}

      <Button className="mt-4" disabled={urgency === "high" && !proofDocument}>
        Submit Request
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
          <Button
            variant={role === "individual" ? "default" : "outline"}
            onClick={() => setRole("individual")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Individual
          </Button>
          <Button
            variant={role === "ngo" ? "default" : "outline"}
            onClick={() => setRole("ngo")}
            className="flex items-center gap-2"
          >
            <Building2 className="h-4 w-4" />
            NGO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <RequestForm role={role} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Available Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requestCategories[role].map((category) => (
                <div key={category} className="p-4 rounded-lg bg-muted">
                  <h3 className="font-semibold mb-1">
                    {requestTypeInfo[category].title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {requestTypeInfo[category].description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}