"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const AuthPage = () => {
  const pathname = usePathname();
  const isSignUp = pathname === "/signup";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {isSignUp ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <SignUp afterSignUpUrl="/dashboard" />
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <SignIn afterSignInUrl="/dashboard" />
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
