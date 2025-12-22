import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';

import ThreeDimensionalBlendTextPic from 'assets/Projects/Art/3D_Blend_Text.svg';
import AlohaPic from 'assets/Projects/Art/Aloha.webp';
import BeeLogoPic from 'assets/Projects/Art/Bee_Logo.svg';
import FloralTextPic from 'assets/Projects/Art/Floral_Text.webp';
import GradientFluidPosterPic from 'assets/Projects/Art/Gradient_Fluid_Poster.svg';
import LineArtLogoPic from 'assets/Projects/Art/Line_Art_Logo.svg';
import LineFillLetteringPic from 'assets/Projects/Art/Line_Fill_Lettering.svg';
import LosAngelesPostCardPic from 'assets/Projects/Art/Los_Angeles_Post_Card.webp';
import RetroStripeLetteringPic from 'assets/Projects/Art/Retro_Stripe_Lettering.svg';
import TriFergPic from 'assets/Projects/Art/Tri_Ferg.svg';
import WaterColorPopsiclesPic from 'assets/Projects/Art/Water_Color_Popsicles.svg';
import WellPic from 'assets/Projects/Art/Well.webp';

import { ArtProjectPicture } from 'components/ArtProjects/ArtProjectPicture';

import 'styles/ArtProjects/ArtProjects.css';

export function ArtProjects() {
  return (
    <section id="graphic-design-container" className="page-container">
      <div id="graphic-design-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Art & Design Projects</h2>
        </ScrollAnimation>
      </div>
      <div id="graphic-design-content">
        <div className="row">
          <div className="column">
            <ArtProjectPicture imgSrc={AlohaPic} altText="Aloha Pic" />
            <ArtProjectPicture imgSrc={LosAngelesPostCardPic} altText="LA" />
            <ArtProjectPicture imgSrc={GradientFluidPosterPic} altText="Gradient Poster" />
          </div>
          <div className="column">
            <ArtProjectPicture imgSrc={TriFergPic} altText="Tri Ferg Poster" />
            <ArtProjectPicture imgSrc={LineArtLogoPic} altText="Line Art Logo Poster" />
            <ArtProjectPicture imgSrc={ThreeDimensionalBlendTextPic} altText="3D Blend Text" />
          </div>
          <div className="column">
            <ArtProjectPicture imgSrc={FloralTextPic} altText="Floral Text" />
            <ArtProjectPicture imgSrc={RetroStripeLetteringPic} altText="Retro Stripe Lettering" />
            <ArtProjectPicture imgSrc={BeeLogoPic} altText="Bee Logo" />
          </div>
          <div className="column">
            <ArtProjectPicture imgSrc={LineFillLetteringPic} altText="Line Fill Lettering" />
            <ArtProjectPicture imgSrc={WellPic} altText="Well" />
            <ArtProjectPicture imgSrc={WaterColorPopsiclesPic} altText="Water Color Popsicles" />
          </div>
        </div>
        {/* For Mobile Only */}
        <Swiper
          spaceBetween={50}
          grabCursor={true}
          modules={[Navigation, Pagination]}
          autoHeight={true}
          loop={true}
          navigation={{ enabled: true }}
          pagination={{ clickable: true }}
        >
          <SwiperSlide>
            <img src={AlohaPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={LosAngelesPostCardPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={GradientFluidPosterPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={TriFergPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={LineArtLogoPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={ThreeDimensionalBlendTextPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={FloralTextPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={RetroStripeLetteringPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={BeeLogoPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={LineFillLetteringPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={WellPic} alt="" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={WaterColorPopsiclesPic} alt="" />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}
