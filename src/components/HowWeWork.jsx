import {
  BiRightArrowAlt,
  BiBookAdd,
  BiUserVoice,
  BiPalette,
  BiCut,
  BiPaintRoll,
  BiCamera,
} from "react-icons/bi";

const steps = [
  {
    id: 1,
    title: "Booking Appointment",
    icon: <BiBookAdd size={30} />,
  },
  {
    id: 2,
    title: "Consultation",
    icon: <BiUserVoice size={30} />,
  },
  {
    id: 3,
    title: "Nail Design Selection",
    icon: <BiPalette size={30} />,
  },
  {
    id: 4,
    title: "Nail Preparation & Treatment",
    icon: <BiCut size={30} />,
  },
  {
    id: 5,
    title: "Application & Styling",
    icon: <BiPaintRoll size={30} />,
  },
  {
    id: 6,
    title: "Aftercare & Photo Time",
    icon: <BiCamera size={30} />,
  },
];

import { Slide } from "react-awesome-reveal";

function HowWeWork() {
  return (
    <section className="w-full bg-white pb-14">
      <h3 className="title-text text-center py-7 font-bold text-blue-800 text-4xl font-[mulish] capitalize tracking-wide">
        How we Operate
      </h3>

      <div className="w-11/12 mx-auto flex flex-wrap justify-center gap-6">
        {steps.map((step, index) => (
          <Slide direction="left" cascade damping={0.5}>
          <div key={step.id} className="flex items-center gap-3">
            <div className="bg-cyan-200 flex items-center justify-center flex-col gap-2 py-6 px-6 rounded-xl shadow-xl hover:bg-blue-950 hover:text-white transition-all duration-300 ease-in-out group min-w-[180px]">
              <div className="text-black group-hover:text-white">
                {step.icon}
              </div>
              <h4 className="text-black text-center text-sm md:text-base font-semibold group-hover:text-white">
                {step.title}
              </h4>
            </div>

            {/* Arrow, but hide after the last item */}
            {index !== steps.length - 1 && (
              <BiRightArrowAlt
                size={30}
                className="text-black hidden md:inline"
              />
            )}
          </div>
          </Slide>
        ))}
      </div>
    </section>
  );
}

export default HowWeWork;
