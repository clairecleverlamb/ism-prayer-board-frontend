import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/services/serverAPI";

export default function SignInInline() {
  return (
    <div className="flex flex-col items-center gap-4 mt-10">
      <a
        href={`${SERVER_URL}/auth/google`}
        className="w-64" 
      >
        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          Sign in with an Acts2 Email
        </Button>
      </a>
    </div>
  );
}