import type { Timestamp } from "firebase/firestore";

export type Platform = "instagram" | "facebook";
export type ContentFormat = "post" | "reel" | "carousel" | "story";
export type AspectRatio = "1:1" | "4:5" | "9:16" | "1.91:1";
export type ContentPillar =
  | "product"
  | "style"
  | "education"
  | "brand"
  | "community"
  | "promotion"
  | "trend";
export type ContentStatus =
  | "idea"
  | "brief"
  | "shoot-planned"
  | "shot"
  | "editing"
  | "ready"
  | "scheduled"
  | "published"
  | "cancelled";
export type CampaignStatus = "planned" | "active" | "completed" | "paused";
export type ProductStatus = "active" | "inactive";

export type ContentType =
  | "product-feature"
  | "product-education"
  | "fashion-editorial"
  | "lifestyle"
  | "styling-tips"
  | "brand-story"
  | "founder-story"
  | "ugc"
  | "influencer"
  | "offer"
  | "sale"
  | "new-launch"
  | "behind-the-scenes"
  | "customer-review"
  | "festival"
  | "engagement"
  | "trend";

export interface BaseEntity {
  id: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface ContentItem extends BaseEntity {
  title: string;
  scheduledDate: Date | null;
  postingTime: string;
  timezone: string;
  platforms: Platform[];
  format: ContentFormat;
  aspectRatio: AspectRatio;
  contentType: ContentType;
  contentPillar: ContentPillar;
  productId: string | null;
  campaignId: string | null;
  caption: string;
  cta: string;
  hashtags: string;
  musicName: string;
  musicArtist: string;
  musicUrl: string;
  driveUrl: string;
  status: ContentStatus;
  publishedUrl: string;
  notes: string;
  createdBy: string;
}

export interface Product extends BaseEntity {
  name: string;
  sku: string;
  collection: string;
  category: string;
  gender: string;
  productUrl: string;
  status: ProductStatus;
}

export interface Campaign extends BaseEntity {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  objective: string;
  description: string;
  status: CampaignStatus;
}

export interface AppSettings extends BaseEntity {
  timezone: string;
  brandName: string;
}

export type FirestoreDate = Timestamp | Date | null | undefined;
