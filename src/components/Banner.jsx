import { Slide } from "react-awesome-reveal";

function FirstBanner(){
    return (<>
        <section className="py-[50px] bg-white">
            <div className="banner-flex-container w-5/6 my-0 mx-auto flex items-center justify-between p-6 gap-4">
            <Slide direction="left" cascade damping={0.2}>
                <div className="text-banner-container bg-sky-100 py-6 px-8 rounded-xl shadow-xl hover:bg-blue-950 hover:text-white transition-all duration-300 ease-in-out hover:shadow-xl/30 group">
                    <h3 className="text-3xl font-light text-blue-800 font-[mulish] group-hover:text-white">4+</h3>
                    <p className="text-base mt-2 tracking-wide font-[mulish]">Years of Experience</p>
                </div>

                <div className="text-banner-container bg-sky-100 py-6 px-8 rounded-xl shadow-xl hover:bg-blue-950 hover:text-white transition-all duration-300 ease-in-out hover:shadow-xl/30 group">
                    <h3 className="text-3xl font-light text-blue-800 font-[mulish] group-hover:text-white">70,000+</h3>
                    <p className="text-base mt-2 tracking-wide font-[mulish]">Satisfied Customers</p>
                </div>
    
                <div className="text-banner-container bg-sky-100 py-6 px-8 rounded-xl shadow-xl hover:bg-blue-950 hover:text-white transition-all duration-300 ease-in-out hover:shadow-xl/30 group">
                    <h3 className="text-3xl font-light text-blue-800 font-[mulish] group-hover:text-white">22,000+</h3>
                    <p className="text-base mt-2 tracking-wide font-[mulish]">Nail Services Completed</p>
                </div>
                <div className="text-banner-container bg-sky-100 py-6 px-8 rounded-xl shadow-xl hover:bg-blue-950 hover:text-white transition-all duration-300 ease-in-out hover:shadow-xl/30 group">
                    <h3 className="text-3xl font-light text-blue-800 font-[mulish] group-hover:text-white">5</h3>
                    <p className="text-base mt-2 tracking-wide font-[mulish]">Certified Nail Technicians</p>
                </div>
            </Slide>
            </div>
        </section>
    </>);
}

export default FirstBanner;