import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/DB-configure.js";
import { Link } from "react-router-dom";

function Logout() {


  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut(auth);
        localStorage.clear();

        // Prevent browser back navigation
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
          window.history.go(1);
        };

      
      } catch (error) {
        console.error("Logout failed:", error.message);
        alert("Error during logout.");
      }
    };

    performLogout();
  },[]);

  return (
    <section className="w-full h-screen bg-white p-2">
      <div className="bg-blue-600 py-20 px-10 rounded-md shadow-md mt-[50px]">
        <p className="lg:text-8xl sm:text-4xl md:text-4xl text-4xl font-[mulish] text-white font-bold tracking-wide">
          you are Logged out
        </p>
      </div>
      <p className="text-base pt-2 font-[mulish]">Click here to redirect to <Link to="/" className="bg-gray-400 px-2 py-1 text-white rounded">Home</Link></p>
    </section>
  );
}

export default Logout;
