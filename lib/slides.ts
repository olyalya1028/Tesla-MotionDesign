export interface SlideData {
  src: string;
  alt: string;
  tagline?: string;
  title: string;
  meta: string;
}

export const vehicleSlides: SlideData[] = [
  {
    src: "/assets/vehicle-model-y-l-premium.png",
    alt: "Silver Tesla Model Y L Premium parked on a city street",
    tagline: "Long Wheelbase Midsize SUV",
    title: "Model Y L Premium",
    meta: "Starting at $61,990",
  },
  {
    src: "/assets/vehicle-model-3.png",
    alt: "Tesla Model 3 sport sedan on an open road",
    tagline: "Sport Sedan",
    title: "Model 3",
    meta: "Lease From $419/mo",
  },
  {
    src: "/assets/vehicle-model-y.png",
    alt: "Tesla Model Y midsize SUV on a desert road",
    tagline: "Midsize SUV",
    title: "Model Y",
    meta: "Lease From $499/mo",
  },
];

export const energySlides: SlideData[] = [
  {
    src: "/assets/energy-solar-panels.png",
    alt: "Tesla solar panels installed on a house roof",
    title: "Solar Panels",
    // Figma's own copy is reproduced verbatim, typo included ("Bil" not "Bill").
    meta: "Power Your Home and Reduce Your Electricity Bil",
  },
  {
    src: "/assets/energy-powerwall.png",
    alt: "Tesla Powerwall mounted on a wall",
    title: "Powerwall",
    meta: "Keep Your Lights On During Outages",
  },
];
