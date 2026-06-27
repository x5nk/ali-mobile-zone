export type Product = {
  id: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  image: string;
  stock: number;
  description: string;
};

export const CATEGORIES = [
  "Chargers",
  "Headphones",
  "Earbuds",
  "Ronin Products",
  "Apple Products",
  "Mobile Covers",
] as const;

export const SEED_PRODUCTS: Product[] = [
  // Chargers - Ronin
  { id: "r-615", name: "R-615 Charger Android", price: 1025, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-615-charger-android.jpg", stock: 24, description: "Fast Android charger with durable cable and reliable output for everyday charging." },
  { id: "r-666-a", name: "R-666 Charger Android", price: 815, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-666-charger-android.jpg", stock: 30, description: "Compact Android charger built for safe and steady power delivery." },
  { id: "r-666-c", name: "R-666 Charger Type-C", price: 845, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-666-charger-type-c.jpg", stock: 28, description: "Type-C charger with stable output, ideal for modern smartphones." },
  { id: "r-777", name: "R-777 Charger Android", price: 795, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-777-charger-android.jpg", stock: 40, description: "Reliable Android charger at an unbeatable price." },
  { id: "r-6020", name: "R-6020 Wizard Charger", price: 4295, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6020-wizard.jpg", stock: 8, description: "Premium fast-charging wizard with multi-port output." },
  { id: "r-6025", name: "R-6025 Charger", price: 1995, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6025-charger.jpg", stock: 15, description: "High-output charger for fast and safe charging." },
  { id: "r-6030", name: "R-6030 Charger", price: 2045, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6030-charger.jpg", stock: 12, description: "Premium build with fast charging support." },
  { id: "r-6035", name: "R-6035 Charger", price: 2395, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6035-charger.jpg", stock: 10, description: "Fast charger with smart protection circuits." },
  { id: "r-6040", name: "R-6040 Charger", price: 8195, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6040-charger.jpg", stock: 4, description: "Flagship multi-port charger for power users." },
  { id: "r-6045", name: "R-6045 Charger", price: 2395, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6045-charger.jpg", stock: 11, description: "Reliable fast charger with premium feel." },
  { id: "r-6050", name: "R-6050 Charger", price: 1245, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6050-charger.jpg", stock: 20, description: "Compact daily-use charger with solid performance." },
  { id: "r-6055", name: "R-6055 Charger", price: 815, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6055-charger.jpg", stock: 35, description: "Affordable charger with safe output for any phone." },
  { id: "r-6060", name: "R-6060 Charger", price: 2445, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6060-charger.jpg", stock: 9, description: "Premium fast charger with sturdy cable." },
  { id: "r-6065", name: "R-6065 Charger", price: 3995, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-6065-charger.jpg", stock: 6, description: "High-end charger with rapid charging tech." },
  { id: "r-2505", name: "R-2505 Car Charger", price: 1545, brand: "Ronin", category: "Chargers", image: "https://alimobilezone.com/cdn/shop/files/r-2505-car-charger.jpg", stock: 18, description: "Dual-port car charger for fast on-the-go power." },
  // Headphones
  { id: "r-1500", name: "R-1500 Headphone", price: 5695, brand: "Ronin", category: "Headphones", image: "https://alimobilezone.com/cdn/shop/files/r-1500-headphone.jpg", stock: 7, description: "Over-ear headphones with deep bass and comfortable fit." },
  { id: "r-1515", name: "R-1515 Headphone", price: 8995, brand: "Ronin", category: "Headphones", image: "https://alimobilezone.com/cdn/shop/files/r-1515-headphone.jpg", stock: 5, description: "Premium wireless headphones with crystal clear sound." },
  { id: "r-7010", name: "R-7010 Mystique", price: 5395, brand: "Ronin", category: "Headphones", image: "https://alimobilezone.com/cdn/shop/files/r-7010-mystique.jpg", stock: 6, description: "Mystique series headphones with rich audio profile." },
  { id: "r-7050", name: "R-7050 Eminence", price: 5795, brand: "Ronin", category: "Headphones", image: "https://alimobilezone.com/cdn/shop/files/r-7050-eminence.jpg", stock: 6, description: "Eminence headphones — balanced sound, long battery life." },
  // Earbuds
  { id: "airbuds-lightning", name: "Air Buds Apple Copy Lightning", price: 2000, brand: "Generic", category: "Earbuds", image: "https://alimobilezone.com/cdn/shop/files/apple-copy-earbuds-lightning.jpg", stock: 22, description: "High-quality Apple-style lightning earbuds at an affordable price." },
  { id: "anker-r50i", name: "Anker Soundcore R50i Wireless Earbuds", price: 3000, brand: "Anker", category: "Earbuds", image: "https://alimobilezone.com/cdn/shop/files/anker-soundcore-r50i.jpg", stock: 14, description: "Anker Soundcore R50i wireless earbuds with great battery life." },
  { id: "airpods-4", name: "Apple AirPods 4", price: 6500, brand: "Apple", category: "Apple Products", image: "https://alimobilezone.com/cdn/shop/files/airpods-4.jpg", stock: 10, description: "Apple AirPods 4 — premium sound and seamless connectivity." },
  { id: "airpods-max-2", name: "Apple AirPods Max 2 A+", price: 2000, brand: "Apple", category: "Apple Products", image: "https://alimobilezone.com/cdn/shop/files/airpods-max-2.jpg", stock: 8, description: "Apple AirPods Max 2 A+ replica with rich, immersive sound." },
  { id: "audionic-850", name: "Audionic Trance Airbud 850", price: 10000, brand: "Audionic", category: "Earbuds", image: "https://alimobilezone.com/cdn/shop/files/audionic-trance-airbud-850.jpg", stock: 5, description: "Audionic Trance Airbud 850 — flagship wireless audio experience." },
  // Ronin earphones
  { id: "r-09-silicon", name: "R-09 Silicon", price: 10195, brand: "Ronin", category: "Ronin Products", image: "https://alimobilezone.com/cdn/shop/files/r-09-silicon.jpg", stock: 7, description: "R-09 Silicon — premium Ronin earphones with comfort tips." },
  { id: "r-09-luxe", name: "R-09 Luxe", price: 11095, brand: "Ronin", category: "Ronin Products", image: "https://alimobilezone.com/cdn/shop/files/r-09-luxe.jpg", stock: 5, description: "R-09 Luxe — top-tier Ronin earphones for audiophiles." },
  { id: "r-09-ultra", name: "R-09 Ultra", price: 10595, brand: "Ronin", category: "Ronin Products", image: "https://alimobilezone.com/cdn/shop/files/r-09-ultra.jpg", stock: 6, description: "R-09 Ultra — flagship Ronin earphones with deep bass." },
  { id: "r-010-silicon", name: "R-010 Silicon", price: 10295, brand: "Ronin", category: "Ronin Products", image: "https://alimobilezone.com/cdn/shop/files/r-010-silicon.jpg", stock: 6, description: "R-010 Silicon — premium fit and sound, the new Ronin standard." },
];

export const BEST_SELLER_IDS = new Set(["r-615", "r-1515", "anker-r50i", "airpods-4", "r-09-luxe"]);
export const NEW_IDS = new Set(["r-6065", "r-010-silicon", "r-09-ultra", "audionic-850", "r-2505"]);
