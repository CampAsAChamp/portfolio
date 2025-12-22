import ScrollAnimation from 'react-animate-on-scroll'
import 'swiper/css'
import 'swiper/css/effect-cards'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { ArtProjectPicture } from 'components/ArtProjects/ArtProjectPicture'

import ThreeDimensionalBlendTextPic from 'assets/Projects/Art/3D_Blend_Text.svg'
import AlohaPic from 'assets/Projects/Art/Aloha.webp'
import BeeLogoPic from 'assets/Projects/Art/Bee_Logo.svg'
import FloralTextPic from 'assets/Projects/Art/Floral_Text.webp'
import GradientFluidPosterPic from 'assets/Projects/Art/Gradient_Fluid_Poster.svg'
import LineArtLogoPic from 'assets/Projects/Art/Line_Art_Logo.svg'
import LineFillLetteringPic from 'assets/Projects/Art/Line_Fill_Lettering.svg'
import LosAngelesPostCardPic from 'assets/Projects/Art/Los_Angeles_Post_Card.webp'
import RetroStripeLetteringPic from 'assets/Projects/Art/Retro_Stripe_Lettering.svg'
import TriFergPic from 'assets/Projects/Art/Tri_Ferg.svg'
import WaterColorPopsiclesPic from 'assets/Projects/Art/Water_Color_Popsicles.svg'
import WellPic from 'assets/Projects/Art/Well.webp'

import 'styles/ArtProjects/ArtProjects.css'

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
            <ScrollAnimation animateIn="animate__fadeInUp" delay={0} animateOnce>
              <ArtProjectPicture imgSrc={AlohaPic} altText="Aloha Pic" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={100} animateOnce>
              <ArtProjectPicture imgSrc={LosAngelesPostCardPic} altText="LA" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={200} animateOnce>
              <ArtProjectPicture imgSrc={GradientFluidPosterPic} altText="Gradient Poster" />
            </ScrollAnimation>
          </div>
          <div className="column">
            <ScrollAnimation animateIn="animate__fadeInUp" delay={50} animateOnce>
              <ArtProjectPicture imgSrc={TriFergPic} altText="Tri Ferg Poster" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={150} animateOnce>
              <ArtProjectPicture imgSrc={LineArtLogoPic} altText="Line Art Logo Poster" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={250} animateOnce>
              <ArtProjectPicture imgSrc={ThreeDimensionalBlendTextPic} altText="3D Blend Text" />
            </ScrollAnimation>
          </div>
          <div className="column">
            <ScrollAnimation animateIn="animate__fadeInUp" delay={100} animateOnce>
              <ArtProjectPicture imgSrc={FloralTextPic} altText="Floral Text" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={200} animateOnce>
              <ArtProjectPicture imgSrc={RetroStripeLetteringPic} altText="Retro Stripe Lettering" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={300} animateOnce>
              <ArtProjectPicture imgSrc={BeeLogoPic} altText="Bee Logo" />
            </ScrollAnimation>
          </div>
          <div className="column">
            <ScrollAnimation animateIn="animate__fadeInUp" delay={150} animateOnce>
              <ArtProjectPicture imgSrc={LineFillLetteringPic} altText="Line Fill Lettering" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={250} animateOnce>
              <ArtProjectPicture imgSrc={WellPic} altText="Well" />
            </ScrollAnimation>
            <ScrollAnimation animateIn="animate__fadeInUp" delay={350} animateOnce>
              <ArtProjectPicture imgSrc={WaterColorPopsiclesPic} altText="Water Color Popsicles" />
            </ScrollAnimation>
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
  )
}
