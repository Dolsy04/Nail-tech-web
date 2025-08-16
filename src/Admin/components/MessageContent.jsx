import React, { useState, useEffect } from "react";
import { IoFilterOutline, IoArrowBackCircleSharp, IoSearchSharp } from "react-icons/io5";
import { db } from "../../Firebase/DB-configure.js";
import { collection, query, getDocs, orderBy, doc, updateDoc } from "firebase/firestore";

function MessageContent() {
  const [message, setMessage] = useState([]);
  const [fliterValue, setFliterValue] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLimit = 3;
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [response, setResponse] = useState("");
  const [expanded, setExpanded] = useState(false);


  useEffect(() => {
        const handleFetchMessage = async () => {
        setLoading(true);

        try {
            const FetchMessage = query(
            collection(db, "messages-db"),
            orderBy("createdAt", "desc")
            );
            const querySnapShot = await getDocs(FetchMessage);
            let data = querySnapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));
            setMessage(data);
        } catch (error) {
            console.error("Error Fetch:", error.message);
            setResponse(`Error occured : ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    handleFetchMessage();
    const intervalId = setInterval(handleFetchMessage, 7200000);

    return () => clearInterval(intervalId);
    
  }, []);

  const updateMessageStatus = async (id) => {
  try {
    const messageRef = doc(db, "messages-db", id);
    await updateDoc(messageRef, { status: "read" });

    setMessage((prev) =>
      prev.map((msg) =>
        msg.id === id ? { ...msg, status: "read" } : msg
      )
    );
  } catch (error) {
    console.error("Failed to update message status:", error.message);
  }
};


  const getFliterAppoinment = () => {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return message.filter((msg) => {
      const matchSearch =
        (msg.firstname?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (msg.lastname?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (msg.email?.toLowerCase() || "").includes(lowerSearchTerm) ||
        (msg.phonenumber?.toString().toLowerCase() || "").includes(
          lowerSearchTerm
        ) ||
        (msg.createdAt?.toString().toLowerCase() || "").includes(
          lowerSearchTerm
        );

      if (fliterValue === "read") {
        return msg.status === "read" && matchSearch;
      }
      if (fliterValue === "unread") {
        return msg.status === "unread" && matchSearch;
      }
      return matchSearch;
    });
  };

  useEffect(() => {
    const filtered = getFliterAppoinment();
    setFilteredAppointments(filtered);
    setCurrentPage(1);
  }, [message, searchTerm, fliterValue]);


  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * pageLimit,
    currentPage * pageLimit
  );

  const totalPages = Math.ceil(filteredAppointments.length / pageLimit);

  return (
    <>
      <section>
        <div className="flex items-center justify-between mt-6 px-4 message-title-search">
          <div>
            <h2 className="font-[mulish] text-3xl uppercase font-semibold text-blue-600 tracking-wide message-title">
              Incoming Messages
            </h2>
            <p className="font-[mulish] text-base font-semibold text-green-700">
              Incoming messages from NT-HUB Website
            </p>
          </div>
          <div className="search-bar-container max-w-[50%] w-full h-[40px] flex items-center justify-between rounded-full bg-white px-5">
            <button className="border-none h-full text-gray-700 cursor-pointer">
              <IoSearchSharp />
            </button>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Message by Name, Contact and by Email .."
              className="w-full h-full text-sm font-[mulish] px-2 outline-hidden focus:border-none"
            />
            
          </div>
        </div>
      </section>

      <div className="message-status-filter flex items-center justify-between mt-[20px] px-4 py-2">
        <div className="stauts-container w-full p-3 flex item-center gap-4">
            <div className="bg-white flex items-center justify-center gap-3 p-4 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700 group status">
              <p className="text-sm font-[mulish] tracking-wide group-hover:text-white ">
                Read 
              </p>
              <p className="text-md font-[mulish] group-hover:text-white group-hover:italic">
                {String(
                  message.filter((msg) => msg.status === "read").length
                ).padStart(2, "0")}
              </p>
            </div>
            <div className="bg-white flex items-center justify-center gap-3 p-4 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-700 group status">
              <p className="text-sm font-[mulish] tracking-wide group-hover:text-white">
                Unread
              </p>
              <p className="text-sm font-[mulish] group-hover:text-white group-hover:italic">
                {String(
                  message.filter((msg) => msg.status === "unread").length
                ).padStart(2, "0")}
              </p>
            </div>
        </div>

        <div className="filter-container bg-white p-1 rounded-md  flex items-center gap-3">
          <p className="font-[mulish] text-md tracking-wide rounded-sm px-2 py-1 flex items-center gap-[3px]">
            <IoFilterOutline size={20} className="text-blue-700" /> Filter:
          </p>
          <select
            value={fliterValue}
            onChange={(e) => setFliterValue(e.target.value)}
            className="border-1 border-gray-300  p-2 rounded-sm font-[mulish] text-md tracking-wide mt-1"
          >
            <option
              className="font-[mulish] text-md tracking-wide"
              onClick={() => setFliterValue("all")}
              value="all"
            >
              All
            </option>
            <option
              className="font-[mulish] text-md tracking-wide"
              onClick={() => setFliterValue("read")}
              value="read"
            >
              Read
            </option>
            <option
              className="font-[mulish] text-md tracking-wide"
              onClick={() => setFliterValue("unread")}
              value="unread"
            >
              Unread
            </option>
          </select>
        </div>
      </div>

      <section className="pb-3">
        <div>
          {loading ? (
            <p className="text-center py-5 text-2xl font-semibold text-blue-600 font-[mulish] tracking-wide">
              Loading Messages.....
            </p>
          ) : paginatedAppointments.length === 0 ? (
            <div className="text-center mt-3 font-[mulish] font-bold text-2xl text-[#38363d]">
              {message.length === 0
                ? `No Messages Found / ${response}`
                : "No Messages Found for this search term or filter"}
            </div>
          ) : (
            paginatedAppointments.map((msg, index) => (
              <div
                key={msg.id}
                className={`messages-bar ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-100"
                } mr-2 mt-3 rounded cursor-pointer`}
                onClick={() => {
                    const updatedMsg = msg.status !== "read" ? { ...msg, status: "read" } : msg;
                    if (msg.status !== "read") {
                        updateMessageStatus(msg.id);
                    }
                  setSelectedMessage(updatedMsg);
                  setShowModal(true);
                }}
              >
                <div className="flex items-center justify-between p-2">
                  <div className="flex gap-3 items-center Dp-names-text">
                    <p className="DP uppercase bg-blue-700 max-w-[50px] w-full h-[50px] flex items-center justify-center rounded-full text-yellow-300 font-extrabold text-2xl font-[mulish]">
                      {msg.firstname.charAt("0")}
                      {msg.lastname.charAt("0")}
                    </p>
                    <div className="ml-4 message-name-container">
                      <p className="message-name text-md tracking-wide font-[mulish] text-[#010379] capitalize font-bold">
                        {msg.firstname} {msg.lastname}
                      </p>
                      <p className="font-[mulish] text-sm text-gray-500 font-medium">
                        {msg.messageBox.length > 10
                          ? `${msg.messageBox.slice(0, 30)}...`
                          : msg.messageBox}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-end justify-center flex-col">
                    <p className="font-[mulish] text-sm font-bold tracking-wide flex items-center gap-1">
                      <span
                        className={`w-[8px] h-[8px] rounded-full ${
                          msg.status === "read" ? "bg-blue-700" : "bg-red-600"
                        }`}
                      ></span>
                      <span
                        className={
                          msg.status === "read"
                            ? "text-blue-700"
                            : "text-red-600"
                        }
                      >
                        {msg.status}
                      </span>
                    </p>
                    <p className="message-date-time text-sm text-gray-400 font-normal font-[mulish]">
                      {msg.dateTimeSent}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
         
        <div className="flex items-center justify-end gap-2 my-4 px-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-500 font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage >= totalPages}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer"
          >
            Next
          </button>
        </div>
      </section>

      {showModal && selectedMessage && (
        <section className="bg-[#0000008e] fixed inset-0 z-10 flex items-center justify-center ">
          <div className="bg-white max-w-[450px] w-full break-words whitespace-pre-wrap h-full rounded overflow-hidden">
            <div>
                {/* message---header */}
                <div className="message-details-header flex items-center gap-3 p-2">
                    <div>
                        <IoArrowBackCircleSharp
                            size={30}
                            className="text-red-600 cursor-pointer"
                            onClick={() => setShowModal(false)}
                        />
                    </div>
                    <div className="flex items-center gap-3 justify-between message-dp-info">
                        <p className="DP-datails uppercase bg-blue-700 max-w-[50px] w-full h-[50px] flex items-center justify-center rounded-full text-yellow-300 font-extrabold text-2xl font-[mulish]">
                            {selectedMessage.firstname.charAt("0")}
                            {selectedMessage.lastname.charAt("0")}
                        </p>
                        <div className="message-details-info w-full break-words">
                            <p className="text-md tracking-wide font-[mulish] text-[#010379] capitalize font-bold break-words">{selectedMessage.firstname} {selectedMessage.lastname}</p>
                            <p className="font-[mulish] text-sm text-gray-700 font-medium break-all">{selectedMessage.email} - {selectedMessage.phonenumber ? selectedMessage.phonenumber : "No contact number"}</p>
                           
                        </div>
                    </div>
                </div>

                <hr className="mt-2 border-t-2 border-gray-300"/>

                {/* message ---- details-- */}
                <div className="w-full max-h-[550px] p-2 bg-[#d0bebe] rounded-b overflow-y-scroll" style={{scrollbarWidth: "none", msOverflowStyle: "none", wordWrap: "break-word",  overflowWrap: "break-word",}}>
                    <div className="bg-[#f4ebeb] py-1 px-2 rounded break-words">
                        <p className="text-md font-[mulish] font-normal text-[#000] break-words">
                            {expanded ? selectedMessage.messageBox : `${selectedMessage.messageBox.slice(0, 700)}....`}
                            {selectedMessage.messageBox.length > 700 && (
                                <button onClick={() => setExpanded(prev => !prev)} className="text-blue-600 font-semibold font-[mulish] text-sm ml-1 cursor-pointer">{expanded ? "Show less" : "Read more"}</button>
                            )}
                        </p>
                        <div className="flex items-end justify-end flex-col">
                            <p className="font-[mulish] text-sm text-gray-700 break-all">{selectedMessage.dateTimeSent}</p>
                            <p className="font-[mulish] text-sm font-bold tracking-wide flex items-center gap-1">
                                <span className={`w-[8px] h-[8px] rounded-full ${selectedMessage.status === "read" ? "bg-blue-700" : "bg-red-600"}`}></span>
                                <span className={selectedMessage.status === "read" ? "text-blue-700" : "text-red-600"}>{selectedMessage.status}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div> 
        </section>
      )}
    </>
  );
}

export default MessageContent;
