import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/contexts/UserContext";
import { login } from "@/services/authService"; 
import { toast } from "sonner";

export default function SignInInline() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!username.trim()) return;
    
    try {
      setLoading(true);
      const user = await login(username);
      setUser(user);
      toast.success(`Welcome, ${user.username}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-64"
      />
      <Button onClick={handleSignIn} className="w-64" disabled={loading}>
        {loading ? "Signing In..." : "Enter Prayer Board"}
      </Button>
    </div>
  );
}
