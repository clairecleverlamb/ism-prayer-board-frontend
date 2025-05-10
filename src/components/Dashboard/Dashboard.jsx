import { useEffect, useState, useContext, useRef } from "react";
import { getPrayers, createPrayer, prayFor, deletePrayer } from "../../services/prayerService";
import { fetchCurrentUser } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PrayerCard from "./PrayerCard";
import SignInInline from "./SignInInline";
import PrayerDialogForm from "./PrayerDialogForm";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";


function CarouselCounter({ current, total }) {
  return (
    <div className="mt-3 text-center text-xs text-gray-500">
      <span className="inline-block bg-gray-100 rounded px-2 py-1">
        {current} / {total}
      </span>
    </div>
  );
}

function CardIndex({ current, total }) {
  return (
    <div className="mt-3 text-center text-xs text-gray-500">
      <span className="inline-block bg-gray-100 rounded px-2 py-1 flex items-center justify-center gap-1">
        <AnimatePresence mode="wait">
          <motion.span
            key={current}
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 5, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-indigo-600 font-semibold text-sm"
          >
            {current}
          </motion.span>
        </AnimatePresence>
        <span className="text-gray-500">/ {total}</span>
      </span>
    </div>
  );
}

const Dashboard = () => {
  const { user, setUser } = useContext(UserContext);
  const [hasWelcomed, setHasWelcomed] = useState(false);
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
  const [authChecked, setAuthChecked] = useState(false);
  const carouselRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);


  const adminEmails = ["shufei.lei@acts2.network", "karen.lei@acts2.network", "claire.chen@acts2.network" ];

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const data = await fetchCurrentUser();
        setUser(data);
        if (!hasWelcomed) {
          toast.success(`Welcome, ${data.name || data.email}!`);
          setHasWelcomed(true);
        }
      } catch (err) {
        console.log("User not logged in");
      } finally {
        setAuthChecked(true);
      }
    };
    checkLogin();
  }, [hasWelcomed, setUser]);

  useEffect(() => {
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

    if (user) {
      fetchPrayers();
    }
  }, [user]);

  // Show toast on redirect error
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "InvalidEmail") {
      toast.error("Only Acts2 Network emails are allowed.");
    } else if (error === "InvalidProfile") {
      toast.error("Could not retrieve your Google profile.");
    } else if (error === "OAuthError") {
      toast.error("Something went wrong during sign-in. Please try again.");
    }
  }, []);


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

      if (carouselRef.current) {
        setTimeout(() => {
          const firstSlide = carouselRef.current.querySelector("[data-carousel-slide='0']");
          if (firstSlide) {
            firstSlide.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 300);
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
    const prayer = prayers.find((p) => p._id === prayerId);
    const isCreator = user && prayer?.createdBy?._id === user._id;
    const isAdmin = user && adminEmails.includes(user.email);

    if (!isCreator && !isAdmin) {
      toast.error("Only the creator or an admin can delete this prayer.");
      return;
    }

    try {
      await deletePrayer(prayerId);
      setPrayers((prev) => prev.filter((p) => p._id !== prayerId));
      toast.success("Prayer deleted successfully!");
    } catch (err) {
      console.error("Error deleting prayer", err);
      toast.error("Failed to delete prayer.");
    }
  };

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Checking authentication...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen px-4 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-sm mb-4">ISM Prayer Board</h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Welcome to the ISM Prayer Board. Please sign in with your Acts2 Network email to view and join in prayer for students.
        </p>
        <SignInInline />
      </div>
    );
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading prayers...</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 pt-20 sm:pt-6 max-w-screen-md mx-auto relative">
      {prayers.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCarousel((prev) => !prev)}
          className="fixed top-4 right-4 z-50 bg-white shadow-md hover:scale-105 transition-transform"
        >
          {isCarousel ? "Grid View 🧱" : "Carousel 🎠"}
        </Button>
      )}

      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2 tracking-tight drop-shadow-sm">
          ISM Prayer Board
        </h1>
        <p className="text-gray-500 text-sm">TODAY WE PRAY FOR OUR STUDENTS</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-xs gap-3 mb-1">
        <Button onClick={() => setDialogOpen(true)} className="w-full">
          + Add New Prayer
        </Button>
      </div>

      <div className="text-center w-full text-gray-600 text-sm mb-6">
        Showing <span className="font-semibold text-indigo-600">{prayers.length}</span> prayer{prayers.length === 1 ? '' : 's'}
      </div>

      {prayers.length > 0 ? (
        <AnimatePresence mode="wait">
          {isCarousel ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex justify-center px-2"
              ref={carouselRef}
            >
            <>
              <Carousel
                className="w-full max-w-md mx-auto"
                setApi={(api) => {
                  if (!api) return;
                  setCurrentSlideIndex(api.selectedScrollSnap() + 1); 
                  api.on("select", () => {
                    setCurrentSlideIndex(api.selectedScrollSnap() + 1);
                  });
                }}
              >
                <CarouselContent>
                  {prayers.map((prayer, idx) => (
                    <CarouselItem key={prayer._id} className="p-2" data-carousel-slide={idx}>
                      <div className="flex flex-col items-center">
                        <PrayerCard
                          prayer={prayer}
                          user={user}
                          onTogglePray={handleTogglePray}
                          onDelete={handleDeletePrayer}
                        />
                        <CardIndex current={currentSlideIndex} total={prayers.length} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-2"
            >
              {prayers.map((prayer) => (
                <PrayerCard
                  key={prayer._id}
                  prayer={prayer}
                  user={user}
                  onTogglePray={handleTogglePray}
                  onDelete={handleDeletePrayer}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <p className="text-gray-400 mt-4">No prayers submitted yet.</p>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-6">
          <PrayerDialogForm
            prayer={newPrayer}
            onChange={setNewPrayer}
            onSubmit={handleCreatePrayer}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
