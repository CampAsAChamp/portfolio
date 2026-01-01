import ThreeDimensionalBlendTextPic from "assets/Projects/Art/3D_Blend_Text.svg"
import AlohaPic from "assets/Projects/Art/Aloha.webp"
import BeeLogoPic from "assets/Projects/Art/Bee_Logo.svg"
import FloralTextPic from "assets/Projects/Art/Floral_Text.webp"
import GradientFluidPosterPic from "assets/Projects/Art/Gradient_Fluid_Poster.svg"
import LineArtLogoPic from "assets/Projects/Art/Line_Art_Logo.svg"
import LineFillLetteringPic from "assets/Projects/Art/Line_Fill_Lettering.svg"
import LosAngelesPostCardPic from "assets/Projects/Art/Los_Angeles_Post_Card.webp"
import RetroStripeLetteringPic from "assets/Projects/Art/Retro_Stripe_Lettering.svg"
import TriFergPic from "assets/Projects/Art/Tri_Ferg.svg"
import WaterColorPopsiclesPic from "assets/Projects/Art/Water_Color_Popsicles.svg"
import WellPic from "assets/Projects/Art/Well.webp"
import { ArtProject } from "types/project.types"

export const artProjects: ArtProject[] = [
  {
    id: "aloha",
    name: "Aloha",
    imageSrc: AlohaPic,
    altText: "Aloha Pic",
  },
  {
    id: "los-angeles-post-card",
    name: "Los Angeles Post Card",
    imageSrc: LosAngelesPostCardPic,
    altText: "LA",
  },
  {
    id: "gradient-fluid-poster",
    name: "Gradient Fluid Poster",
    imageSrc: GradientFluidPosterPic,
    altText: "Gradient Poster",
  },
  {
    id: "tri-ferg",
    name: "Tri Ferg",
    imageSrc: TriFergPic,
    altText: "Tri Ferg Poster",
  },
  {
    id: "line-art-logo",
    name: "Line Art Logo",
    imageSrc: LineArtLogoPic,
    altText: "Line Art Logo Poster",
  },
  {
    id: "3d-blend-text",
    name: "3D Blend Text",
    imageSrc: ThreeDimensionalBlendTextPic,
    altText: "3D Blend Text",
  },
  {
    id: "floral-text",
    name: "Floral Text",
    imageSrc: FloralTextPic,
    altText: "Floral Text",
  },
  {
    id: "retro-stripe-lettering",
    name: "Retro Stripe Lettering",
    imageSrc: RetroStripeLetteringPic,
    altText: "Retro Stripe Lettering",
  },
  {
    id: "bee-logo",
    name: "Bee Logo",
    imageSrc: BeeLogoPic,
    altText: "Bee Logo",
  },
  {
    id: "line-fill-lettering",
    name: "Line Fill Lettering",
    imageSrc: LineFillLetteringPic,
    altText: "Line Fill Lettering",
  },
  {
    id: "well",
    name: "Well",
    imageSrc: WellPic,
    altText: "Well",
  },
  {
    id: "water-color-popsicles",
    name: "Water Color Popsicles",
    imageSrc: WaterColorPopsiclesPic,
    altText: "Water Color Popsicles",
  },
]
