import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Users, BookOpen, Truck } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Making Donations Smarter
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect with NGOs and make a difference in your community. Donate food, clothes, books, and essentials to those in need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/donations">Start Donating</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/requests">Make Requests</Link>
          </Button>
          
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12  ">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:flex justify-between">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Donations</h3>
              <p className="text-muted-foreground">
                Easily list your items for donation and connect with local NGOs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">NGO Verification</h3>
              <p className="text-muted-foreground">
                All NGOs are verified to ensure your donations reach the right hands.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Pickup</h3>
              <p className="text-muted-foreground">
                Schedule convenient pickup times and track your donation in real-time.
              </p>
            </CardContent>
          </Card>

         
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-card rounded-lg px-6 my-12">
        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
            <p className="text-muted-foreground">Items Donated</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">50+</p>
            <p className="text-muted-foreground">Partner NGOs</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
            <p className="text-muted-foreground">Lives Impacted</p>
          </div>
        </div>
      </section>



      <footer className="bg-card py-8 mt-12 border-t">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Make a Difference Today</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Donate essentials or request help. Together, we can create a stronger community.
        </p>
       
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Donations Platform. All rights reserved.</p>
      </div>
    </footer>
    </div>
  );
}