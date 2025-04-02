"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Check, X } from "lucide-react";

const mockRequests = [
  { id: 1, name: "Food Donation", category: "food", description: "Requesting food supplies for 50 families.", location: "New York", urgency: "high", file: "food_donation.pdf" },
  { id: 2, name: "Clothing Drive", category: "clothes", description: "Winter clothes for underprivileged children.", location: "Los Angeles", urgency: "medium", file: "clothing_donation.pdf" },
  { id: 3, name: "Book Contribution", category: "books", description: "Books for a community library.", location: "Chicago", urgency: "low", file: "book_donation.pdf" },
];

export default function ApproveRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState(mockRequests);
  const userRole = "admin"; // Replace with authentication logic

  if (userRole !== "admin") {
    router.push("/");
    return <p className="text-center text-red-500 py-12">Access Denied</p>;
  }

  const approveRequest = (id) => {
    setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Approve Donation Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request.id} className="shadow-lg border rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {request.name}
                <Badge variant={request.urgency === "high" ? "destructive" : "default"}>{request.urgency.toUpperCase()}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">{request.description}</p>
              <p className="text-sm text-primary font-semibold">Location: {request.location}</p>
              <div className="flex items-center gap-2 mt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{request.name}</DialogTitle>
                    </DialogHeader>
                    <p><strong>Category:</strong> {request.category}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Location:</strong> {request.location}</p>
                    <p><strong>Urgency:</strong> {request.urgency}</p>
                    <a href={`/${request.file}`} className="text-primary underline mt-2 block" download>
                      Download Attached File
                    </a>
                  </DialogContent>
                </Dialog>
                <Button variant="success" className="flex items-center gap-1" onClick={() => approveRequest(request.id)}>
                  <Check className="h-4 w-4" /> Approve
                </Button>
                <Button variant="destructive" className="flex items-center gap-1">
                  <X className="h-4 w-4" /> Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}