import { PiUsersThreeDuotone } from "react-icons/pi";
import { GiFingernail } from "react-icons/gi";
import { MdDesignServices } from "react-icons/md";
import { db } from "../../Firebase/DB-configure.js";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

function TotalBanners() {
  const [totalCustomer, setTotalCustomer] = useState([]);
  const [totalTech, setTotalTech] = useState([]);
  const [totalServices, setTotalServices] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [upcomingNext24Hours, setUpcomingNext24Hours] = useState([]);;
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");

  const getCustomer = async () => {
    const customerRef = collection(db, "customer-db");
    const snapShot = await getDocs(query(customerRef));
    const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTotalCustomer(data);
  };

  const getTech = async () => {
    const techRef = collection(db, "technicial-db");
    const snapShot = await getDocs(query(techRef));
    const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTotalTech(data);
  };

  const getServices = async () => {
    const servicesRef = collection(db, "Services-db");
    const snapShot = await getDocs(query(servicesRef));
    const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTotalServices(data);
  };

  const fetchNextAppointments = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 1 * 60 * 60 * 1000);
      const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const apptRef = collection(db, "appointment-booked");
      const q = query(
        apptRef,
        where("timestamp", ">=", Timestamp.fromDate(now)),
        where("status", "==", "pending")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        const datetime = raw.timestamp?.toDate
          ? raw.timestamp.toDate()
          : new Date(raw.timestamp.seconds * 1000);
        return { id: doc.id, ...raw, datetime };
      });

      const sorted = data.sort((a, b) => a.datetime - b.datetime);

      const upcoming1Hour = sorted.filter(
        (a) => a.datetime >= now && a.datetime <= oneHourLater
      );
      const upcoming24Hour = sorted.filter(
        (a) =>  a.datetime > oneHourLater && a.datetime <= twentyFourHoursLater
      );

      setUpcomingAppointments(upcoming1Hour);
      setUpcomingNext24Hours(upcoming24Hour);
    } catch (err) {
      console.error("Error fetching appointments:", err.message);
      setResponse(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCustomer();
    getTech();
    getServices();
    fetchNextAppointments();

    const interval = setInterval(() => {
      fetchNextAppointments();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="overview-content">
      <div className="mt-3 flex items-center justify-around flex-wrap gap-4">
        <div className="bg-white min-w-[300px] p-4 rounded-xl flex items-center justify-between hover:bg-blue-700 group transition-all duration-300 ease-in-out">
          <div>
            <p className="font-[mulish] text-lg font-semibold group-hover:text-white">
              Total Customers
            </p>
            <p className="font-[mulish] text-2xl font-bold mt-5 group-hover:text-white">
              {String(totalCustomer.length).padStart(2, "0")}
            </p>
          </div>
          <PiUsersThreeDuotone size={30} className="text-blue-700 group-hover:text-yellow-300" />
        </div>

        <div className="bg-white min-w-[300px] p-4 rounded-xl flex items-center justify-between hover:bg-blue-700 group transition-all duration-300 ease-in-out">
          <div>
            <p className="font-[mulish] text-lg font-semibold group-hover:text-white">
              Total Technicians
            </p>
            <p className="font-[mulish] text-2xl font-bold mt-5 group-hover:text-white">
              {String(totalTech.length).padStart(2, "0")}
            </p>
          </div>
          <GiFingernail size={30} className="text-blue-700 group-hover:text-yellow-300" />
        </div>

        <div className="bg-white min-w-[300px] p-4 rounded-xl flex items-center justify-between hover:bg-blue-700 group transition-all duration-300 ease-in-out">
          <div>
            <p className="font-[mulish] text-lg font-semibold group-hover:text-white">
              Total Services
            </p>
            <p className="font-[mulish] text-2xl font-bold mt-5 group-hover:text-white">
              {String(totalServices.length).padStart(2, "0")}
            </p>
          </div>
          <MdDesignServices size={30} className="text-blue-700 group-hover:text-yellow-300" />
        </div>
      </div>

      <section className="bg-white p-6 rounded shadow-md mt-6 mr-5 hour-appoinmnent-banner">
        {response}
            <h2 className="text-xl font-semibold text-blue-600 my-4">Upcoming Appointments (Next 1 Hour)</h2>
            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : upcomingAppointments.length === 0 ? (
                <p className="text-red-600 font-semibold">No upcoming appointments in the next 1 hour.</p>
            ) : (
                <ul className="space-y-3">
                    {upcomingAppointments.map((appt) => (
                    <li key={appt.id} className="border p-3 rounded hover:bg-gray-50">
                        <p className="text-lg font-semibold text-blue-700 font-[mulish] mb-2">
                        {appt.firstname} {appt.othername} - {appt.servicesTypes}
                        </p>
                        <p className="text-md text-gray-700 font-[mulish] mb-2">
                        {appt.date} @ {appt.time} | {appt.email} | {appt.contactNumber} | {appt.preferredNailTech}
                        </p>
                    </li>
                    ))}
                </ul>
            )}
      </section>


      <section className="bg-white p-6 rounded shadow-md mt-6 mr-5 hour-appoinmnent-banner">
         {response}
            <h2 className="text-xl font-semibold text-blue-600 my-4">Upcoming Appointments (Next 24 Hours)</h2>
                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : upcomingNext24Hours.length === 0 ? (
                    <p className="text-red-600 font-semibold">No upcoming appointments in the next 24 hours.</p>
                ) : (
                <ul className="space-y-3">
                    {upcomingNext24Hours.map((appt) => (
                    <li key={appt.id} className="border p-3 rounded hover:bg-gray-50">
                        <p className="text-lg font-semibold text-blue-700 font-[mulish] mb-2">
                        {appt.firstname} {appt.othername} - {appt.servicesTypes}
                        </p>
                        <p className="text-md text-gray-700 font-[mulish] mb-2">
                        {appt.date} @ {appt.time} | {appt.email} | {appt.contactNumber}  | {appt.preferredNailTech}
                        </p>
                    </li>
                    ))}
                </ul>
            )}
      </section>
    </section>
  );
}

export default TotalBanners;








