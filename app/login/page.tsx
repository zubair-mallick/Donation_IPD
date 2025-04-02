import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn routing="hash" />
    </div>
  );
}
