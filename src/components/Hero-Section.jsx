import Header from "./Header.jsx";
import { Slide, Fade, Bounce } from "react-awesome-reveal";

function HeroSection({aboutClick, reviewsClick, openAdminBtn}){
    return(
        <>
           <Header aboutClick={aboutClick} reviewsClick={reviewsClick} openAdminBtn={openAdminBtn}/>

           <div className="w-3/4 min-h-[400px] flex items-center justify-center text-white  mt-5 mb-0 mx-auto">
                <div className="w-full h-full flex items-center justify-center">
                    <div>
                        <Slide delay={50} direction="left"  duration={2000} cascade damping={0.1}>
                        {/* <Bounce> */}
                            <h1 className="hero-text text-white text-center text-6xl  uppercase mt-2 mb-4 font-bold tracking-wide">Get the best nail done</h1>
                            <p className="text-center uppercase text-2xl font-bold tracking-wider ">at</p>
                            <h1 className="hero-text text-white text-center text-6xl uppercase my-2 font-bold tracking-wide">our Nail Tech Hub</h1>
                        {/* </Bounce> */}
                        </Slide>
                    </div>
                </div>
           </div>
        </>
    );
}

export default HeroSection;