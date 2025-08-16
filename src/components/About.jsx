import aboutImage from "/src/assets/about-image.png";
import { Fade } from "react-awesome-reveal";

function About({openAppointmentBtn}) {
  return (
    <>
      <section className="w-full bg-cyan-100">
        <div className="about-flex-container w-5/6 py-6 my-0 mx-auto flex items-start justify-between gap-[30px]">
          <Fade>
          <div className="max-w-[400px] w-full h-[400px]">
            <img
              src={aboutImage}
              alt="pretty nails image"
              className="about-image w-full h-full  object-cover"
            />
          </div>
          </Fade>  
            
          <div className="about-text-container lg:w-[60%]">
            <h2 className="about-title font-bold text-blue-800 text-4xl font-[mulish] uppercase mb-5 mt-4 underline tracking-wide">
              about us
            </h2>

            <p className="text-base font-[mulish] tracking-wide">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Aspernatur corporis cupiditate nobis, veniam facere hic explicabo
              officia ea repellat quis dolore vel perferendis est ad rem
              consectetur qui. Excepturi nam quas reiciendis obcaecati nisi
              ratione, culpa aspernatur doloremque. Voluptates itaque sunt odit,
              voluptas et dolor veniam, consequatur incidunt culpa provident id?
              Praesentium ut consequuntur accusantium qui aliquid adipisci minus
              molestiae numquam, soluta ea dolores autem excepturi possimus
              omnis consectetur repellat modi quisquam sapiente, earum at in
              magni nulla. Error laboriosam debitis, iste porro, aliquid
              tenetur, assumenda quasi doloribus consequuntur adipisci quod
              possimus cum fuga quas non ullam cupiditate delectus
              exercitationem.
            </p>

            <button className="mt-8 bg-blue-950 py-4 px-6 text-white text-base tracking-wide rounded cursor-pointer transition-all duration-300 ease-in-out hover:bg-blue-800" onClick={openAppointmentBtn}>
              Book an Appoinment
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
