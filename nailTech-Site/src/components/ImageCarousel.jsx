import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  {
    image: "/nail1.jpg",
  },
  {
    image: "/nail7.jpg",
  },
  {
    image: "/nail10.jpg",
  },
  {
    image: "/nail11.jpg",
  },
  {
    image: "/nail13.jpg",
  },
  {
    image: "/nail1.jpg",
  },
  {
    image: "/nail7.jpg",
  },
  {
    image: "/nail11.jpg",
  },
];

function ImageCarousel() {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    pauseOnHover: true,
    responsive: [
    {
      breakpoint: 1024, // small laptops
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768, // tablets
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 640, // small phones
      settings: {
        slidesToShow: 1,
      },
    },
  ],
  };

  return (
    <div className="py-9 bg-cyan-100">
      <div className=" w-full max-w-4xl mx-auto overflow-hidden">
        <Slider {...settings}>
          {images.map((src, i) => (
            <div key={i} className="pr-4">
              <img src={src.image} alt={`Slide ${i + 1}`} className="w-full h-[300px] object-cover rounded" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default ImageCarousel;
