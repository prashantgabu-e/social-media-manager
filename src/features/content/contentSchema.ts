import { z } from "zod";
import {
  aspectRatios,
  contentFormats,
  contentPillars,
  contentStatuses,
  contentTypes,
  platforms,
} from "../../types/options";
import { isValidExternalUrl } from "../../lib/utils";

export const contentSchema = z.object({
  title: z.string().min(2, "Title is required"),
  date: z.string().min(1, "Date is required"),
  postingTime: z.string().min(1, "Posting time is required"),
  platforms: z.array(z.enum(platforms as [string, ...string[]])).min(1, "Choose at least one platform"),
  format: z.enum(contentFormats as [string, ...string[]]),
  aspectRatio: z.enum(aspectRatios as [string, ...string[]]),
  contentType: z.enum(contentTypes as [string, ...string[]]),
  contentPillar: z.enum(contentPillars as [string, ...string[]]),
  productId: z.string().optional(),
  campaignId: z.string().optional(),
  caption: z.string().optional(),
  cta: z.string().optional(),
  hashtags: z.string().optional(),
  musicName: z.string().optional(),
  musicArtist: z.string().optional(),
  musicUrl: z.string().optional().refine(isValidExternalUrl, "Enter a valid URL"),
  driveUrl: z.string().optional().refine(isValidExternalUrl, "Enter a valid URL"),
  status: z.enum(contentStatuses as [string, ...string[]]),
  publishedUrl: z.string().optional().refine(isValidExternalUrl, "Enter a valid URL"),
  notes: z.string().optional(),
});

export type ContentFormValues = z.infer<typeof contentSchema>;

export const defaultContentValues: ContentFormValues = {
  title: "",
  date: new Date().toISOString().slice(0, 10),
  postingTime: "19:30",
  platforms: ["instagram"],
  format: "reel",
  aspectRatio: "9:16",
  contentType: "product-feature",
  contentPillar: "product",
  productId: "",
  campaignId: "",
  caption: "",
  cta: "",
  hashtags: "",
  musicName: "",
  musicArtist: "",
  musicUrl: "",
  driveUrl: "",
  status: "idea",
  publishedUrl: "",
  notes: "",
};

export function toScheduledDate(date: string, postingTime: string) {
  const [hours, minutes] = postingTime.split(":").map(Number);
  const value = new Date(`${date}T00:00:00`);
  value.setHours(hours || 0, minutes || 0, 0, 0);
  return value;
}
