import type {
  AspectRatio,
  CampaignStatus,
  ContentFormat,
  ContentPillar,
  ContentStatus,
  ContentType,
  Platform,
} from "./index";

export const platforms: Platform[] = ["instagram", "facebook"];
export const contentFormats: ContentFormat[] = ["post", "reel", "carousel", "story"];
export const aspectRatios: AspectRatio[] = ["1:1", "4:5", "9:16", "1.91:1"];
export const contentTypes: ContentType[] = [
  "product-feature",
  "product-education",
  "fashion-editorial",
  "lifestyle",
  "styling-tips",
  "brand-story",
  "founder-story",
  "ugc",
  "influencer",
  "offer",
  "sale",
  "new-launch",
  "behind-the-scenes",
  "customer-review",
  "festival",
  "engagement",
  "trend",
];
export const contentPillars: ContentPillar[] = [
  "product",
  "style",
  "education",
  "brand",
  "community",
  "promotion",
  "trend",
];
export const contentStatuses: ContentStatus[] = [
  "idea",
  "brief",
  "shoot-planned",
  "shot",
  "editing",
  "ready",
  "scheduled",
  "published",
  "cancelled",
];
export const campaignStatuses: CampaignStatus[] = [
  "planned",
  "active",
  "completed",
  "paused",
];

export const defaultTimezone = "Asia/Kolkata";
