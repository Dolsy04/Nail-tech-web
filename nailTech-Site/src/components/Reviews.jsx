import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Reviews() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const reviews = [
    {
      id: 1,
      name: "Nimah A",
      event: "Engagement Shoot",
      reviewText: "My nails were flawless for my engagement shoot — they matched my outfit perfectly and looked amazing in every photo!",
      image: "/nimah.jpg",
    },
    {
      id: 2,
      name: "Amaka O",
      event: "Wedding",
      reviewText: "They made my bridal nails absolutely perfect — elegant, glossy, and exactly my vibe!",
      image: "/amaka.jpg",
    },
    {
      id: 3,
      name: "Tolu B",
      event: "Birthday",
      reviewText: "Booked them for my birthday glam and wow, my nails were the center of attention!",
      image: "/tolu.jpg",
    },
    {
      id: 4,
      name: "Chioma K",
      event: "Corporate Event",
      reviewText: "Needed something classy for a corporate event, and they nailed the look perfectly.",
      image: "/chioma.jpg",
    },
    {
      id: 5,
      name: "Zainab M",
      event: "Graduation",
      reviewText: "I wanted a bold set for my graduation, and they delivered beyond expectations!",
      image: "/zainab.jpg",
    },
    {
      id: 6,
      name: "Peace E",
      event: "Vacation",
      reviewText: "Went in for a simple vacation set, left with nails that felt like luxury!",
      image: "/peace.jpg",
    },
      {
      id: 7,
      name: "Jessica A",
      event: "Wedding Guest",
      reviewText: "Got my nails done for a wedding I was attending — everyone asked where I did them!.",
      image: "/jessical.jpg",
    },
  ]

  return (
    <>
      <section className="bg-cyan-100 pt-[30px] w-full px-4 pb-8">
        <h3 className="review-title text-center py-7 font-bold text-blue-800 text-4xl font-[mulish] capitalize tracking-wide">Reviews from customer</h3>

        <div className=" slider-container w-5/6 my-0 mx-auto">
          <Slider {...settings}>

            {reviews.map((item)=>(
                <div key={item.id} className="px-4 mb-5">
                    <div className="bg-white rounded-xl shadow-md p-5 h-full flex flex-col items-center justify-between text-center">
                        <p className="mb-4 text-gray-700 text-base font-[mulish] italic">"{item.reviewText}"</p>
                        <div>
                            <img src={item.image} alt={item.name} className="w-[120px] h-[120px] object-cover rounded-full mb-3 font-[mulish]"/>

                            <div>
                                <p className="font-semibold text-lg font-[mulish]">{item.name}</p>
                                <p className="text-gray-500 text-sm font-[mulish]">{item.event}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
}

export default Reviews;
