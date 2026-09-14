import { addDays, setHours, setMinutes } from "date-fns";
import { createCampaign } from "./campaignService";
import { createContent } from "./contentService";
import { createProduct } from "./productService";
import type { Campaign, Product } from "../types";

export async function seedDemoData(uid: string) {
  const products: Omit<Product, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Black Stitchless Tee",
      sku: "DR-BST-001",
      collection: "Core",
      category: "T-Shirt",
      gender: "Men",
      productUrl: "https://example.com/products/black-stitchless-tee",
      status: "active",
    },
    {
      name: "Ivory Oversized Shirt",
      sku: "DR-IOS-014",
      collection: "Resort",
      category: "Shirt",
      gender: "Women",
      productUrl: "https://example.com/products/ivory-oversized-shirt",
      status: "active",
    },
    {
      name: "Charcoal Cargo Pants",
      sku: "DR-CCP-021",
      collection: "Utility",
      category: "Pants",
      gender: "Unisex",
      productUrl: "https://example.com/products/charcoal-cargo-pants",
      status: "active",
    },
  ];

  const productRefs = await Promise.all(products.map(createProduct));

  const campaigns: Omit<Campaign, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "Monsoon Editorial",
      startDate: new Date(),
      endDate: addDays(new Date(), 28),
      objective: "Build premium editorial recall",
      description: "A restrained fashion-forward launch arc for monsoon styling.",
      status: "active",
    },
    {
      name: "Festive Layering",
      startDate: addDays(new Date(), 20),
      endDate: addDays(new Date(), 55),
      objective: "Promote versatile festive combinations",
      description: "Style-led product education for occasion wear.",
      status: "planned",
    },
  ];

  const campaignRefs = await Promise.all(campaigns.map(createCampaign));

  const baseDate = setMinutes(setHours(new Date(), 19), 30);
  const examples = [
    ["Black Stitchless Editorial", "reel", "ready"],
    ["Ivory Shirt Styling Tips", "carousel", "brief"],
    ["Founder Note: Why Fit Matters", "post", "idea"],
    ["Cargo Pants Product Education", "reel", "shoot-planned"],
    ["Behind the Scenes Studio", "story", "shot"],
    ["Weekend Lifestyle Look", "post", "editing"],
    ["Festival Moodboard", "carousel", "scheduled"],
    ["Customer Review Texture", "post", "published"],
    ["Trend: Clean Monochrome", "reel", "idea"],
    ["Offer Teaser", "story", "brief"],
  ] as const;

  await Promise.all(
    examples.map(([title, format, status], index) =>
      createContent({
        title,
        scheduledDate: addDays(baseDate, index + 1),
        postingTime: index % 2 === 0 ? "19:30" : "12:00",
        timezone: "Asia/Kolkata",
        platforms: index % 3 === 0 ? ["instagram", "facebook"] : ["instagram"],
        format,
        aspectRatio: format === "reel" || format === "story" ? "9:16" : "4:5",
        contentType: index % 2 === 0 ? "product-feature" : "styling-tips",
        contentPillar: index % 2 === 0 ? "product" : "style",
        productId: productRefs[index % productRefs.length].id,
        campaignId: campaignRefs[index % campaignRefs.length].id,
        caption: "",
        cta: "Explore the look",
        hashtags: "#dareandrise #fashion",
        musicName: "",
        musicArtist: "",
        musicUrl: "",
        driveUrl: "https://drive.google.com/",
        status,
        publishedUrl: status === "published" ? "https://instagram.com/" : "",
        notes: "",
        createdBy: uid,
      }),
    ),
  );
}
