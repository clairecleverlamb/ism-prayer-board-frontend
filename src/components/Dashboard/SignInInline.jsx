import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserContext } from "@/contexts/UserContext";

export default function SignInInline() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");

  const handleSignIn = () => {
    if (!username.trim()) return;

    const fakeUser = {
      _id: Date.now().toString(), 
      username,
    };
    localStorage.setItem("user", JSON.stringify(fakeUser));
    setUser(fakeUser);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Input
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-64"
      />
      <Button onClick={handleSignIn} className="w-64">
        Enter Prayer Board
      </Button>
    </div>
  );
}
