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
    altText: "Typography poster with the word Aloha in tropical lettering",
  },
  {
    id: "los-angeles-post-card",
    name: "Los Angeles Post Card",
    imageSrc: LosAngelesPostCardPic,
    altText: "Illustrated Los Angeles postcard design",
  },
  {
    id: "gradient-fluid-poster",
    name: "Gradient Fluid Poster",
    imageSrc: GradientFluidPosterPic,
    altText: "Abstract fluid shapes poster with purple and blue gradients",
  },
  {
    id: "tri-ferg",
    name: "Tri Ferg",
    imageSrc: TriFergPic,
    altText: "Geometric Tri Ferg portrait poster illustration",
  },
  {
    id: "line-art-logo",
    name: "Line Art Logo",
    imageSrc: LineArtLogoPic,
    altText: "Minimal line-art logo mark on a solid background",
  },
  {
    id: "3d-blend-text",
    name: "3D Blend Text",
    imageSrc: ThreeDimensionalBlendTextPic,
    altText: "Dimensional blended typography study",
  },
  {
    id: "floral-text",
    name: "Floral Text",
    imageSrc: FloralTextPic,
    altText: "Letterforms filled with floral botanical patterns",
  },
  {
    id: "retro-stripe-lettering",
    name: "Retro Stripe Lettering",
    imageSrc: RetroStripeLetteringPic,
    altText: "Retro striped hand-lettering composition",
  },
  {
    id: "bee-logo",
    name: "Bee Logo",
    imageSrc: BeeLogoPic,
    altText: "Bee logo mark with geometric wing details",
  },
  {
    id: "line-fill-lettering",
    name: "Line Fill Lettering",
    imageSrc: LineFillLetteringPic,
    altText: "Lettering design with parallel line-fill shading",
  },
  {
    id: "well",
    name: "Well",
    imageSrc: WellPic,
    altText: "Well typographic poster with layered letterforms",
  },
  {
    id: "water-color-popsicles",
    name: "Water Color Popsicles",
    imageSrc: WaterColorPopsiclesPic,
    altText: "Watercolor illustration of colorful popsicles",
  },
]
