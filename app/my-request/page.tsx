"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const mockRequests = [
  { id: 1, title: "Blood Test Report Analysis", status: "pending", description: "Request for AI-powered blood test report analysis.", date: "2025-04-01", file: "blood_report.pdf" },
  { id: 2, title: "Skin Disease Diagnosis", status: "approved", description: "Request for AI skin disease detection.", date: "2025-03-29", file: "skin_scan.jpg" },
  { id: 3, title: "MRI Scan Review", status: "fulfilled", description: "Request for AI-based MRI scan review.", date: "2025-03-25", file: "mri_scan.dcm" },
  { id: 4, title: "General Health Consultation", status: "rejected", description: "Request for AI medical consultation.", date: "2025-03-28", file: "health_summary.txt" },
];

const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-blue-500",
  fulfilled: "bg-green-500",
  rejected: "bg-red-500",
};

export default function MyRequests() {
  const [filter, setFilter] = useState("all");

  const filteredRequests =
    filter === "all" ? mockRequests : mockRequests.filter((req) => req.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Requests</h1>
      
      <div className="flex justify-center gap-4 mb-6">
        {["all", "pending", "approved", "fulfilled", "rejected"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle>{request.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <Badge className={`${statusColors[request.status]} text-white`}>{request.status}</Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="text-sm">View Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{request.title}</DialogTitle>
                      </DialogHeader>
                      <p className="text-sm">{request.description}</p>
                      <p className="text-xs text-muted-foreground">Submitted on: {request.date}</p>
                      {request.file && (
                        <a href={`#`} className="text-blue-500 underline text-sm" download>{request.file}</a>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No requests found.</p>
        )}
      </div>
    </div>
  );
}