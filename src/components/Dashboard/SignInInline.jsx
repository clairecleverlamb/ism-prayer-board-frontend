// src/components/dashboard/SignInInline.jsx

import { Button } from "@/components/ui/button";


export default function SignInInline() {
  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:3000/auth/google"; // TODO: Replace it later 
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <Button
        onClick={handleGoogleSignIn}
        className="w-64 flex items-center justify-center gap-2"
        variant="outline"
      >
        Sign in with an Acts2 Email
      </Button>
    </div>
  );
}
