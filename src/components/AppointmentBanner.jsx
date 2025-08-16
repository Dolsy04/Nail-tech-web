import {BiDownArrowAlt} from 'react-icons/bi'
import { Bounce, Slide } from "react-awesome-reveal";

function AppoinmentBanner({openAppointmentBtn}){
    return(<>
        <section className='w-full'>
            <div className='w-5/6 my-0 mx-auto flex items-center justify-center flex-col py-10'>
                <Slide direction='down'>
                    <h3 className='appoinment-text text-white text-center text-5xl font-bold tracking-wider font-[mulish]'>Fast Booking</h3>
                    <p className='py-3 text-lg text-white text-center font-[mulish] tracking-wide'>Want to book an appoinment for an event or personal <br /> Click Here</p>
                </Slide>
                <BiDownArrowAlt size={30} className='text-white'/>
                <Slide direction='up'>
                    <button className='bg-green-700 py-4 px-6 text-lg tracking-wide text-white rounded-[8px] mt-4 transition-all duration-700 ease-in-out cursor-pointer hover:bg-green-900' onClick={openAppointmentBtn}>Book Appoinment</button>
                </Slide>
            </div>
        </section>
    </>);
}

export default AppoinmentBanner;