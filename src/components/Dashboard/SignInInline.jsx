import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/services/serverAPI"; 

export default function SignInInline() {
  const handleGoogleSignIn = () => {
    window.open = (`${SERVER_URL}/auth/google`,  "_self");
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
