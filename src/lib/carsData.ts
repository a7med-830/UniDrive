// src/lib/carsData.ts

export interface Car {
  id: string;
  make: string;
  name: string;
  trim: string;
  year: number;
  price: string;
  description: string;
  image: string;
  images: string[];
  features: string[];
  specs: Record<string, string>;
  videoUrl?: string; 
  videoFocus?: string;
}

export const allCars: Car[] = [
  {
    id: "UNIDRIVE-rolls-phantom",
    make: "ROLLS-ROYCE",
    name: "PHANTOM",
    trim: "UNIDRIVE SERIES II",
    year: 2024,
    price: "€ 1,240,000",
    description:
      "An unparalleled testament to the pinnacle of automotive artistry. Every surface has been sculpted with obsessive precision — from the hand-formed carbon-fibre bodywork to the bespoke interior, each element whispers of excess refined into purpose. This is not transportation. This is a declaration.",
    image: "/top 4 cars/images/rolls/1A.jpg",
    images: [
      "/top 4 cars/images/rolls/2B.jpg",
      "/top 4 cars/images/rolls/3C.jpg",
      "/top 4 cars/images/rolls/4D.jpg",
      "/top 4 cars/images/rolls/5E.jpg",
      "/top 4 cars/images/rolls/6F.jpg",
    ],
    features: [
      "Full Carbon Fiber Body Kit",
      "Bespoke Hand-Stitched Leather Interior",
      "Starlight Headliner — 1,340 Fibre Optics",
      "Forged 24″ Monoblock Alloy Wheels",
      "Active Titanium Exhaust System",
      "UNIDRIVE Sport Suspension",
      "Night Vision Assist Pro",
      "Rear Theatre Configuration",
    ],
    specs: {
      "Engine": "6.75L Twin-Turbo V12",
      "Power": "571 bhp",
      "Torque": "900 Nm",
      "0–100 km/h": "5.3 s",
      "Top Speed": "250 km/h",
      "Weight": "2,560 kg",
      "Transmission": "8-speed Automatic",
      "Drivetrain": "RWD",
    },
    videoUrl: "/top 4 cars/Videos/R1.mp4",
  },
  
  {
    id: "porsche-panamera", // غيرت الـ ID لاسم أوضح بدل 28
    make: "PORSCHE", 
    name: "PANAMERA", 
    year: 2024,
    price: "$ 187,650",
    description: "Where high-performance engineering meets the soul of a sports car. The Panamera Turbo E-Hybrid stands as a testament to Porsche's relentless pursuit of perfection. From its sharpened silhouette to the seamless integration of E-Hybrid technology, every detail is a canvas for individualization. Discover the art of driving, redefined by UNIDRIVE.",
    image: "/top 4 cars/images/p/77b4ecacace0e00ca825fe3f710b4fa4.jpg",
    images: [
       "/top 4 cars/images/p/91bae0281fcb601cb6862e52d24f1b92.jpg",
       "/top 4 cars/images/p/17544c7a9c7696f179eb060f6f37bb9e.jpg",
       "/top 4 cars/images/p/e5a4f0465a94172e2129539c2200e208.jpg",  
       "/top 4 cars/images/p/e9dfb7b838733afad4f9ac744e387b70.jpg",
       "/top 4 cars/images/p/effaee768d1d2dd0ba49da4ce8f8e988.jpg"
      ],
    videoUrl: "/top 4 cars/Videos/P1.mp4",
    trim: "Turbo E-Hybrid",
    features: ["680 hp Combined Output", "Active Suspension", "Night Vision"],
    specs: {
      "Engine": "4.0L V8 Biturbo Hybrid", 
      "Power": "680 bhp",
      "Torque": "850 Nm",
      "0–100 km/h": "3.2 s",
      "Top Speed": "315 km/h"
    }
  },

  {
    id: "Mercedes",
    make: "Mercedes‑Maybach",
    name: "S‑Class ",
    trim: "UNIDRIVE STALLONE",
    year: 2026,
    price: "€ 920,000",
    description:
      "The Mercedes-Maybach S-Class represents the absolute pinnacle of luxury sedans. A fully reimagined flagship with bespoke customization, cutting-edge technology, and a commanding presence on the road. The Stallone edition showcases dark styling cues and exclusive engineering.",
    image: "/Images-home/6ca3bb49af970e54f445948e1ce21c9d.jpg",
    images: [
        "/top 4 cars/images/m/1m.jpg",
        "/top 4 cars/images/m/2m.jpg",
        "/top 4 cars/images/m/3m.jpg",
        "/top 4 cars/images/m/4m.jpg",
        "/top 4 cars/images/m/5m.jpg",
    ],
    videoUrl: "/top 4 cars/Videos/m3.mp4",
    features: ["Dry Carbon Monocoque", "1,100 bhp Hybrid", "Active Aero"],
    specs: {
      "Engine": "6.0L Bi-Turbo V12", 
      "Power": "612 bhp",
      "Torque": "900 Nm",
      "0–100 km/h": "4.5 s"
    }
  },
{
    id: "cadillac",
    make: "Cadillac",
    name: "Escalade",
    trim: "V-Series Bespoke", 
    year: 2025,
    price: "$ 169,000", 
    description:
      "The ultimate expression of American luxury, elevated to unprecedented heights. This bespoke Escalade commands attention with its imposing widebody stance, exposed carbon fiber accents, and a roaring supercharged V8. Step inside a meticulously handcrafted cabin where absolute comfort meets raw, uncompromising power.",
    image: "/top 4 cars/images/c/11c.jpg",
    images: [
      "/top 4 cars/images/c/2c.jpg",
      "/top 4 cars/images/c/3c.jpg",
      "/top 4 cars/images/c/4C.jpg",
      "/top 4 cars/images/c/5c.jpg",
      "/top 4 cars/images/c/6c.jpg"
    ],
    videoUrl: "/top 4 cars/Videos/C.mp4",
  
    features: ["Widebody Carbon Kit", "820 bhp Performance Tune", "Forged Monoblock Rims"],
    specs: {
      Engine: "6.2L Supercharged V8", 
      Power: "820 bhp", 
      Torque: "1,150 Nm", 
      "0–100 km/h": "3.9 s", 
    },
  },
];
export function getCarById(id: string): Car | undefined {
  return allCars.find((c) => c.id === id);
}

export function getAllCars(): Car[] {
  return allCars;
}
