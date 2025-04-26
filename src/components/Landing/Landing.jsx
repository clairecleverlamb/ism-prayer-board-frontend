import { Button } from "@/components/ui/button";
import DashboardNavBar from "../DashboardNavBar/DashboardNavBar";
import { Link } from "react-router";

const Landing = () => {
  return (
    <div className="w-full bg-gradient-to-b from-blue-100 via-indigo-100 to-white flex flex-col items-center min-h-screen">
      <div className="w-full max-w-[90%]">
        <DashboardNavBar />
        <main className="min-h-screen flex flex-col items-center justify-center">
          <div className="w-full md:w-[700px] h-auto mt-[50px] md:mt-[100px] flex flex-col items-center text-center py-8">
            <Button variant="secondary" className="mb-6">
              <Link to="/sign-up"> Join Us in Prayer</Link>
            </Button>

            <h1 className="text-[32px] sm:text-[40px] md:text-[56px] font-poppins font-semibold leading-tight text-gray-800 mb-4">
              Berkeley ISM Prayer Board
            </h1>

            <p className="text-[16px] md:text-[20px] font-poppins font-medium text-gray-600 mb-6">
              Welcome to <span className="text-indigo-600 font-bold">PrayerBoard</span> — 
              Pray for our students today
            </p>

            <Button variant="default" className="mb-6">
              <Link to="/sign-up">Start Praying →</Link>
            </Button>

          </div>

          <div className="w-full md:w-[696px] h-[50vh] mt-10 mb-10 flex items-center justify-center">
            {/* Updated screenshot placeholder */}
            <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-blue-100 flex items-center justify-center rounded-lg shadow-lg">
              <img
                src="/images/prayer-dashboard.png" // <-- Make a new screenshot!
                alt="Prayer Dashboard Screenshot"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="text-gray-500 text-sm text-center w-full py-6">
             ISM PrayerBoard © 2025 
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Landing;


