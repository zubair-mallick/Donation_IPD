"use client";

import { useState, useEffect } from "react";
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

const statusColors = {
  pending: "bg-yellow-500",
  approved: "bg-blue-500",
  fulfilled: "bg-green-500",
  rejected: "bg-red-500",
};

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("api/donations/all");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const categories = ["All", ...new Set(requests.map((req) => req.category))];

  const filteredRequests = requests.filter((req) => {
    return (
      (statusFilter === "all" || req.status === statusFilter) &&
      (categoryFilter === "All" || req.category === categoryFilter)
    );
  });

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Requests</h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {["all", "pending", "approved", "fulfilled", "rejected"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Request Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id} className="w-72 h-72 flex flex-col justify-between overflow-hidden">
              {request.image && (
                <div className="w-full h-40 overflow-hidden">
                  <img src={request.image} alt="Request" className="w-full h-full object-cover" />
                </div>
              )}
              <CardHeader>
                <CardTitle>{request.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col justify-between flex-grow">
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
                      <p className="text-xs text-muted-foreground"><strong>Category:</strong> {request.category}</p>
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
