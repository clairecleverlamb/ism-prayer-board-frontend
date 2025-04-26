import { useEffect, useState, useContext } from "react";
import { getPrayers, createPrayer, prayFor, unprayFor } from "../../services/prayerService";
import { UserContext } from "../../contexts/UserContext";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PrayerCard from "./PrayerCard";
import SignInInline from "./SignInInline";
import PrayerDialogForm from "./PrayerDialogForm";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [prayers, setPrayers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPrayer, setNewPrayer] = useState({
    studentName: "",
    ministryGroup: "",
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrayer = async () => {
    try {
      if (!newPrayer.studentName || !newPrayer.content) {
        alert("Please fill out both Student Name and Prayer Content!");
        return;
      }

      const created = await createPrayer({
        ...newPrayer,
        createdBy: user._id,
      });

      setPrayers((prev) => [created, ...prev]);
      setNewPrayer({ studentName: "", ministryGroup: "", content: "" });
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating prayer", err);
    }
  };

  const handlePray = async (prayerId) => {
    if (!user) {
      alert("Please sign in first to pray!");
      return;
    }
    await prayFor(prayerId, user._id);
    await fetchPrayers();
  };

  const handleUnpray = async (prayerId) => {
    if (!user) {
      alert("Please sign in first to unpray!");
      return;
    }
    await unprayFor(prayerId, user._id);
    await fetchPrayers();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading prayers...</div>;
  }

  return (
    <div className="flex flex-col items-center p-4">
      {!user ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Welcome to ISM Prayer Board 🙏</h1>
          <SignInInline />
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6">Welcome back, {user.username}! ✨</h2>
          <Button onClick={() => setDialogOpen(true)} className="mb-6">
            Add New Prayer
          </Button>
        </>
      )}

      {/* Render all prayers */}
      <div className="flex flex-wrap justify-center gap-4">
        {prayers.map((prayer) => (
          <PrayerCard
            key={prayer._id || Math.random()}
            prayer={prayer}
            userId={user?._id}
            onPray={handlePray}
            onUnpray={handleUnpray}
          />
        ))}
      </div>

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
