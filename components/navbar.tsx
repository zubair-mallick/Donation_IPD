"use client";

import { Button } from "@/components/ui/button";
import { Heart, Home, LogIn, Menu, Moon, Sun, UserPlus, LogOut, CheckCircle, List } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  let isAdmin = false;
  if (isSignedIn) {
    isAdmin = true;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Smart Donation</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/donations" className="transition-colors hover:text-foreground/80">Donate</Link>
            <Link href="/requests" className="transition-colors hover:text-foreground/80">Requests</Link>
            <Link href="/my-request" className="transition-colors hover:text-foreground/80 flex items-center">

              My Requests
            </Link>
            {isAdmin && (
              <Link href="/approve" className="transition-colors hover:text-foreground/80 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                Approve
              </Link>
            )}
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <Heart className="h-6 w-6" />
                <span className="font-bold">Smart Donation</span>
              </Link>
              <Link href="/donations" className="block px-2 py-1 text-lg">Donate</Link>
              <Link href="/requests" className="block px-2 py-1 text-lg">Requests</Link>
              <Link href="/my-requests" className="block px-2 py-1 text-lg flex items-center">
                <List className="h-5 w-5 mr-1 text-blue-600" />
                My Requests
              </Link>
              {isAdmin && (
                <Link href="/approve" className="block px-2 py-1 text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-1 text-green-600" />
                  Approve
                </Link>
              )}
              <Link href="/about" className="block px-2 py-1 text-lg">About</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <div className="flex items-center gap-2">
            {!isSignedIn ? (
              <>
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/login">
                    <LogIn className="h-5 w-5" />
                    <span className="sr-only">Login</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="mr-2" asChild>
                  <Link href="/register">
                    <UserPlus className="h-5 w-5" />
                    <span className="sr-only">Register</span>
                  </Link>
                </Button>
              </>
            ) : (
              <SignOutButton>
                <Button variant="ghost" size="icon" className="mr-2">
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </SignOutButton>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
