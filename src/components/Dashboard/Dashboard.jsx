import { useEffect, useState, useContext } from "react";
import { getPrayers, createPrayer, prayFor, deletePrayer } from "../../services/prayerService";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PrayerCard from "./PrayerCard";
import SignInInline from "./SignInInline";
import PrayerDialogForm from "./PrayerDialogForm";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [prayers, setPrayers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPrayer, setNewPrayer] = useState({
    studentName: "",
    ministryGroup: "",
    status:"",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      const data = await getPrayers();
      setPrayers(data);
    } catch (err) {
      console.error("Error loading prayers", err);
      toast.error("Failed to load prayers.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrayer = async () => {
    if (!newPrayer.studentName || !newPrayer.content) {
      toast.error("Please fill out both Student Name and Prayer Content!");
      return;
    }
    try {
      const created = await createPrayer({ ...newPrayer, createdBy: user._id });
      setPrayers((prev) => [created, ...prev]);
      setNewPrayer({ studentName: "", ministryGroup: "", content: "" });
      setDialogOpen(false);
      toast.success("Prayer created successfully!");
    } catch (err) {
      console.error("Error creating prayer", err);
      toast.error("Failed to create prayer.");
    }
  };

  const handleTogglePray = async (prayerId) => {
    if (!user) {
      toast.error("Please sign in first to pray!"); //keep this toast for unauthenticated users
      return;
    }
  
    try {
      console.log("👉 Sending pray toggle request for:", prayerId, "by user", user._id);
      
      const updatedPrayer = await prayFor(prayerId, user._id); //server toggles and returns updated prayer
      setPrayers((prevPrayers) =>
        prevPrayers.map((p) => (p._id === prayerId ? updatedPrayer : p))
      );
  
    } catch (err) {
      console.error("Error toggling prayer", err);
      toast.error("Failed to pray/unpray."); 
    }
  };
  
  const handleDeletePrayer = async (prayerId) => {
    try {
      await deletePrayer(prayerId);
      setPrayers((prev) => prev.filter(p => p._id !== prayerId));
      toast.success("Prayer deleted successfully!");
    } catch (err) {
      console.error("Error deleting prayer", err);
      toast.error("Failed to delete prayer.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading prayers...</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-screen-md mx-auto">
      {!user ? (
        <>
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to ISM Prayer Board</h1>
          <SignInInline />
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center">Welcome back, {user.username}! ✨</h2>
          <Button onClick={() => setDialogOpen(true)} className="mb-6 w-full max-w-xs">
            + Add New Prayer
          </Button>
        </>
      )}

      {/* Carousel for Prayer Cards */}
      <Carousel className="w-full">
        <CarouselContent>
          {prayers.map((prayer) => (
            <CarouselItem key={prayer._id} className="flex justify-center p-2">
              {/* 👆 flex justify-center here */}
              <PrayerCard
                prayer={prayer}
                userId={user?._id}
                onTogglePray={handleTogglePray}
                onDelete={handleDeletePrayer}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>


      {/* Dialog for adding a prayer */}
      {user && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="p-6">
            <PrayerDialogForm
              prayer={newPrayer}
              onChange={setNewPrayer}
              onSubmit={handleCreatePrayer}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
