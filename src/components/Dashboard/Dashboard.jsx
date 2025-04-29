import { useEffect, useState, useContext, useRef } from "react";
import { getPrayers, createPrayer, prayFor, deletePrayer } from "../../services/prayerService";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PrayerCard from "./PrayerCard";
import SignInInline from "./SignInInline";
import PrayerDialogForm from "./PrayerDialogForm";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [prayers, setPrayers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCarousel, setIsCarousel] = useState(true);
  const [newPrayer, setNewPrayer] = useState({
    studentName: "",
    ministryGroup: "",
    status: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef(null); // for auto-scrolling

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
      setNewPrayer({ studentName: "", ministryGroup: "", status: "", content: "" });
      setDialogOpen(false);
      toast.success("Prayer created successfully!");

      // Auto-scroll to the first slide if in carousel mode
      if (carouselRef.current) {
        setTimeout(() => {
          const firstSlide = carouselRef.current.querySelector("[data-carousel-slide='0']");
          if (firstSlide) {
            firstSlide.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300); // slight delay after DOM updates
      }
    } catch (err) {
      console.error("Error creating prayer", err);
      toast.error("Failed to create prayer.");
    }
  };

  const handleTogglePray = async (prayerId) => {
    if (!user) {
      toast.error("Please sign in first to pray!");
      return;
    }
    try {
      const updatedPrayer = await prayFor(prayerId, user._id);
      setPrayers((prev) => prev.map((p) => (p._id === prayerId ? updatedPrayer : p)));
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
    <div className="flex flex-col items-center px-4 pt-20 sm:pt-6 max-w-screen-md mx-auto relative">
      
      {/* Sticky Toggle Button */}
      {user && prayers.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCarousel(prev => !prev)}
          className="fixed top-4 right-4 z-50 bg-white shadow-md hover:scale-105 transition-transform"
        >
          {isCarousel ? "Grid View 🧱" : "Carousel 🎠"}
        </Button>
      )}

      {/*  Title Area */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2 tracking-tight drop-shadow-sm">
          ISM Prayer Board
        </h1>
        <p className="text-gray-500 text-sm">TODAY WE PRAY FOR OUR STUDENTS</p>
      </div>

      {/* If not signed in */}
      {!user ? (
        <SignInInline />
      ) : (
        <>
          <Button onClick={() => setDialogOpen(true)} className="mb-6 w-full max-w-xs">
            + Add New Prayer
          </Button>
        </>
      )}

      {/* Animate switching layouts */}
      <AnimatePresence mode="wait">
        {isCarousel ? (
          <motion.div
            key="carousel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full flex justify-center"
            ref={carouselRef} // attach ref here
          >
            <Carousel className="w-full max-w-md mx-auto">
              <CarouselContent>
                {prayers.map((prayer, idx) => (
                  <CarouselItem key={prayer._id} className="p-2" data-carousel-slide={idx}>
                    <div className="flex justify-center">
                      <PrayerCard
                        prayer={prayer}
                        userId={user?._id}
                        onTogglePray={handleTogglePray}
                        onDelete={handleDeletePrayer}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full"
          >
            {prayers.map((prayer) => (
              <PrayerCard
                key={prayer._id}
                prayer={prayer}
                userId={user?._id}
                onTogglePray={handleTogglePray}
                onDelete={handleDeletePrayer}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
