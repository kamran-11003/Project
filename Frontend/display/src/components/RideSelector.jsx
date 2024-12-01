import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import RideOption from './RideOption';

const rides = [
  {
    name: 'Ride AC',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Ride Mini',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Motoride',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Horse',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Spiderman',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Superman',
    image: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&q=80&w=300&h=300'
  }
];

const RideSelector = ({ selectedRide, onSelectRide }) => {
  return (
    <div className="mt-6">
      <Swiper
        spaceBetween={8} // Adjust spacing between slides
        slidesPerView={4} // Show 4 slides at a time
        breakpoints={{
          640: { slidesPerView: 2 }, // Smaller screens show 2 slides
          768: { slidesPerView: 3 }, // Medium screens show 3 slides
          1024: { slidesPerView: 4 } // Larger screens show 4 slides
        }}
        className="px-4"
      >
        {rides.map((ride) => (
          <SwiperSlide key={ride.name}>
            <RideOption
              name={ride.name}
              image={ride.image}
              isSelected={selectedRide === ride.name}
              onClick={() => onSelectRide(ride.name)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RideSelector;
