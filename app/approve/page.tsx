"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Check, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function ApproveRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState({});
  const userRole = "admin"; // Replace with authentication logic

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await axios.get("/api/donations/pending", {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
          params: { timestamp: new Date().getTime() }, // Prevents cache
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch donation requests", error);
      }
    }
    fetchRequests();
  }, []);
  

  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/");
    }
  }, [userRole, router]);

  if (userRole !== "admin") {
    return <p className="text-center text-red-500 py-12">Access Denied</p>;
  }

  const handleApproval = async (id, status) => {
    setLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.patch(`/api/donations/${id}/`, { status });
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== id));
      toast.success(`Request ${status === "accepted" ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Failed to update request status", error);
      toast.error("Failed to update request status.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Approve Donation Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <Card key={request._id} className="shadow-lg border rounded-xl overflow-hidden">
            {request.image && (
              <img src={request.image} alt="Request Image" className="w-full h-48 object-cover" style={{ aspectRatio: '1 / 1' }} />
            )}
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {request.name}
                <Badge variant={request.urgency === "high" ? "destructive" : "default"}>{request.urgency.toUpperCase()}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-muted-foreground">{request.description}</p>
              <p className="text-sm text-primary font-semibold">Location: {request?.location}</p>
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
                    <p><strong>Location:</strong> {request?.location}</p>
                    <p><strong>Urgency:</strong> {request.urgency}</p>
                    {request.fileUrl && (
                      <a href={request.fileUrl} className="text-primary underline mt-2 block" target="_blank" rel="noopener noreferrer">
                        View Attached File
                      </a>
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="success" 
                  className="flex items-center gap-1" 
                  onClick={() => handleApproval(request._id, "accepted")}
                  disabled={loading[request._id]}
                >
                  <Check className="h-4 w-4" /> {loading[request._id] ? "Approving..." : "Approve"}
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-1" 
                  onClick={() => handleApproval(request._id, "rejected")}
                  disabled={loading[request._id]}
                >
                  <X className="h-4 w-4" /> {loading[request._id] ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}