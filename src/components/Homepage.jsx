import React, {useState, useRef, useEffect} from "react";
import HeroSection from "./Hero-Section.jsx";
import About from "./About.jsx";
import FirstBanner from "./Banner.jsx";
import Reviews from "./Reviews.jsx";
import AppoinmentBanner from "./AppointmentBanner.jsx";
import ImageCarousel from "./ImageCarousel.jsx";
import HowWeWork from "./HowWeWork.jsx";
import Footer from "./Footer.jsx";
import AppointmentComponent from "./AppointmentComponent.jsx"


function Homepage({ openAdminBtn }) {
  const aboutRef = useRef(null);
  const reviewsRef = useRef(null);
  const howWeWorkRef = useRef(null);
  const bookingRef = useRef(null);

  const [openAppointmentComponent, setOpenAppointmentComponent] = useState(false);


  const openAppointment = () =>{
    setOpenAppointmentComponent(true)
  }
  const closeAppointment = () =>{
    setOpenAppointmentComponent(false)
  }
  
  
  const handleAboutScroll = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleReviewsScroll = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleHowWeWorkScroll = () => {
    howWeWorkRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleBookingScroll = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
     window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
          window.history.go(1);
        };

        const hash = window.location.hash;

        if(hash === "#about"){
          aboutRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (hash === "#reviews") {
          reviewsRef.current?.scrollIntoView({ behavior: "smooth" });
        } else if (hash === "#howwework") {
          howWeWorkRef.current?.scrollIntoView({ behavior: "smooth" });
        }
  },[])

  return (
    <>
      <HeroSection  aboutClick={handleAboutScroll}  reviewsClick={handleReviewsScroll} openAdminBtn={openAdminBtn}/>

      <div ref={aboutRef}>
        <About  openAppointmentBtn={openAppointment}/>
      </div>

      <FirstBanner />
    
      <div ref={reviewsRef}>
        <Reviews />
      </div>

      <div ref={bookingRef}>
        <AppoinmentBanner openAppointmentBtn={openAppointment}/>
      </div>
      
      <ImageCarousel />

      <div ref={howWeWorkRef}>
        <HowWeWork />
      </div>

      <Footer aboutClick={handleAboutScroll} reviewsClick={handleReviewsScroll} howWeWorkClick={handleHowWeWorkScroll} bookingClick={handleBookingScroll}/>
      
      <AppointmentComponent isActive={openAppointmentComponent}  closeComponent={closeAppointment}/>
    </>
  );
}


export default Homepage;