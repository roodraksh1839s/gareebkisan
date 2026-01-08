// TODO: Replace with actual API calls

export interface Farmer {
  name: string
  location: string
  currentCrop: string
  farmSize: number
}

export interface WeatherAlert {
  id: string
  type: "low" | "medium" | "high"
  title: string
  description: string
  date: string
  cropImpact: string
  suggestedAction: string
}

export interface AdvisoryDetail {
  advice: string
  reason: string
  confidence: number
}

export interface CropAdvisory {
  crop: string
  growthStage: string
  sowing: AdvisoryDetail
  irrigation: AdvisoryDetail
  fertilizer: AdvisoryDetail
}

export interface PricePrediction {
  crop: string
  mandi: string
  currentPrice: number
  predictedPrices: Array<{
    date: string
    price: number
  }>
  bestSellingWindow: {
    start: string
    end: string
  }
  recommendation: "sell" | "hold"
  volatility: "low" | "medium" | "high"
}

export interface ForecastDay {
  date: string
  temperature: { min: number; max: number }
  condition: string
  rainfall: number
  riskLevel: "low" | "medium" | "high"
}

export const mockFarmer: Farmer = {
  name: "Ramesh Kumar",
  location: "Bhopal, Madhya Pradesh",
  currentCrop: "Wheat",
  farmSize: 5.2,
}

export const mockWeatherAlerts: WeatherAlert[] = [
  {
    id: "1",
    type: "high",
    title: "Heavy Rainfall Warning",
    description: "Expected 50-70mm rainfall in next 48 hours",
    date: "2024-01-10",
    cropImpact: "May damage standing wheat crop",
    suggestedAction: "Harvest early or provide drainage",
  },
  {
    id: "2",
    type: "medium",
    title: "Temperature Drop",
    description: "Temperature expected to drop to 8°C",
    date: "2024-01-12",
    cropImpact: "Frost risk for sensitive crops",
    suggestedAction: "Cover crops with protective sheets",
  },
]

export const mockCropAdvisory: CropAdvisory = {
  crop: "Wheat",
  growthStage: "Tillering",
  sowing: {
    advice: "Optimal sowing window has passed. Focus on irrigation and fertilization.",
    reason: "Sowing after November 25th reduces yield by 25kg/acre/day due to terminal heat stress.",
    confidence: 95
  },
  irrigation: {
    advice: "Water every 5-7 days. Current soil moisture is adequate.",
    reason: "Tillering stage is critical for crown root initiation. Water stress now leads to poor tillering.",
    confidence: 88
  },
  fertilizer: {
    advice: "Apply 50kg Urea per acre. Nitrogen is critical at this stage.",
    reason: "Plants need maximum Nitrogen during tillering for vegetative growth.",
    confidence: 92
  }
}

export const mockPricePrediction: PricePrediction = {
  crop: "Wheat",
  mandi: "Bhopal Mandi",
  currentPrice: 2450,
  predictedPrices: [
    { date: "2024-01-05", price: 2450 },
    { date: "2024-01-06", price: 2480 },
    { date: "2024-01-07", price: 2520 },
    { date: "2024-01-08", price: 2580 },
    { date: "2024-01-09", price: 2620 },
    { date: "2024-01-10", price: 2650 },
    { date: "2024-01-11", price: 2680 },
    { date: "2024-01-12", price: 2700 },
    { date: "2024-01-13", price: 2720 },
    { date: "2024-01-14", price: 2710 },
    { date: "2024-01-15", price: 2690 },
  ],
  bestSellingWindow: {
    start: "2024-01-12",
    end: "2024-01-14",
  },
  recommendation: "hold",
  volatility: "medium",
}

export const mockForecast: ForecastDay[] = [
  { date: "2024-01-05", temperature: { min: 12, max: 24 }, condition: "Sunny", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-06", temperature: { min: 14, max: 26 }, condition: "Partly Cloudy", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-07", temperature: { min: 15, max: 27 }, condition: "Sunny", rainfall: 0, riskLevel: "low" },
  { date: "2024-01-08", temperature: { min: 16, max: 28 }, condition: "Cloudy", rainfall: 2, riskLevel: "low" },
  { date: "2024-01-09", temperature: { min: 17, max: 26 }, condition: "Cloudy", rainfall: 5, riskLevel: "medium" },
  { date: "2024-01-10", temperature: { min: 10, max: 18 }, condition: "Heavy Rain", rainfall: 55, riskLevel: "high" },
  { date: "2024-01-11", temperature: { min: 8, max: 16 }, condition: "Light Rain", rainfall: 15, riskLevel: "medium" },
]

export const crops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Pulses"]

export const mandis = ["Bhopal Mandi", "Indore Mandi", "Jabalpur Mandi", "Gwalior Mandi"]

export const growthStages = ["Sowing", "Germination", "Tillering", "Flowering", "Grain Filling", "Maturity"]

export interface CommunityPost {
  id: string
  author: string
  avatar: string
  content: string
  likes: number
  comments: number
  time: string
  tags: string[]
}

export interface MarketplaceItem {
  id: string
  name: string
  price: number
  unit: string
  seller: string
  location: string
  image: string
  category: "seeds" | "fertilizers" | "equipment" | "produce"
}

export interface Scheme {
  id: string
  title: string
  description: string
  eligibility: string
  deadline: string
  benefit: string
  link: string
}

export interface FarmLogEntry {
  id: string
  date: string
  activity: string
  cost: number
  notes: string
  category: "labor" | "inputs" | "machinery" | "other"
}

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: "1",
    author: "Gurpreet Singh",
    avatar: "G",
    content: "Has anyone tried the new wheat variety HD-3086? How is the yield compared to HD-2967?",
    likes: 24,
    comments: 12,
    time: "2 hours ago",
    tags: ["Wheat", "Seeds"],
  },
  {
    id: "2",
    author: "Rajesh Kumar",
    avatar: "R",
    content: "Looking for a second-hand tractor (50HP). Please DM if selling.",
    likes: 15,
    comments: 5,
    time: "5 hours ago",
    tags: ["Equipment", "Buying"],
  },
]

export const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    name: "DAP Fertilizer",
    price: 1350,
    unit: "bag",
    seller: "Kisan Sewa Kendra",
    location: "Hoshiarpur",
    image: "https://placehold.co/100?text=DAP",
    category: "fertilizers",
  },
  {
    id: "2",
    name: "Wheat Seeds (Certified)",
    price: 40,
    unit: "kg",
    seller: "Punjab Agro",
    location: "Jalandhar",
    image: "https://placehold.co/100?text=Wheat",
    category: "seeds",
  },
  {
    id: "3",
    name: "Rotavator 6ft",
    price: 95000,
    unit: "piece",
    seller: "Singh Implements",
    location: "Ludhiana",
    image: "https://placehold.co/100?text=Rotavator",
    category: "equipment",
  },
]

export const mockSchemes: Scheme[] = [
  {
    id: "1",
    title: "PM Kisan Samman Nidhi",
    description: "Financial support of ₹6,000 per year to farmer families.",
    eligibility: "Small and marginal farmers",
    deadline: "Open all year",
    benefit: "₹6,000/year",
    link: "https://pmkisan.gov.in",
  },
  {
    id: "2",
    title: "Soil Health Card Scheme",
    description: "Get soil tested and receive a health card with crop-wise nutrient recommendations.",
    eligibility: "All farmers",
    deadline: "Open all year",
    benefit: "Free Soil Testing",
    link: "https://soilhealth.dac.gov.in",
  },
]

export const mockFarmLogs: FarmLogEntry[] = [
  {
    id: "1",
    date: "2024-01-05",
    activity: "Wheat Sowing",
    cost: 5000,
    notes: "Used 50kg seed per acre",
    category: "inputs",
  },
  {
    id: "2",
    date: "2024-01-10",
    activity: "Irrigation Labor",
    cost: 1200,
    notes: "2 laborers for 1 day",
    category: "labor",
  },
]
