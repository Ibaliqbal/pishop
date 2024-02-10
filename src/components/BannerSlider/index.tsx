import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-simple-e6c1f.appspot.com/o/banners%2Fbanner1.png?alt=media&token=dbc14b5a-fb85-4577-9896-9e1a36549270",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-simple-e6c1f.appspot.com/o/banners%2Fbanner3.png?alt=media&token=923f3904-f608-4800-9047-ac22bbfed752",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-simple-e6c1f.appspot.com/o/banners%2Fbanner2.png?alt=media&token=a289a308-b87a-47f4-b112-576f838cfe59",
  "https://firebasestorage.googleapis.com/v0/b/ecommerce-simple-e6c1f.appspot.com/o/banners%2Fbanner4.png?alt=media&token=43ff9fce-5c07-4fb0-a42c-fea4bb84be4b",
];

const BannerSlider = () => {
  return (
    <Swiper
      modules={[Pagination, EffectFade, Autoplay]}
      effect="fade"
      pagination={{ clickable: true }}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
    >
      {images.map((banner, i) => {
        return (
          <SwiperSlide className="bg-blue-400 w-full" key={i}>
            <img
              src={banner}
              loading="lazy"
              alt="Banner"
              className="w-full aspect-[1/0.4] object-cover"
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default BannerSlider;
