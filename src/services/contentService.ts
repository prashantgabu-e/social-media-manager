import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { toDate } from "./firestoreMappers";
import type { ContentItem, ContentStatus } from "../types";

const contentRef = collection(db, "contentItems");

function mapContent(id: string, data: DocumentData): ContentItem {
  return {
    id,
    title: data.title ?? "",
    scheduledDate: toDate(data.scheduledDate),
    postingTime: data.postingTime ?? "",
    timezone: data.timezone ?? "Asia/Kolkata",
    platforms: data.platforms ?? [],
    format: data.format ?? "post",
    aspectRatio: data.aspectRatio ?? "1:1",
    contentType: data.contentType ?? "product-feature",
    contentPillar: data.contentPillar ?? "product",
    productId: data.productId ?? null,
    campaignId: data.campaignId ?? null,
    caption: data.caption ?? "",
    cta: data.cta ?? "",
    hashtags: data.hashtags ?? "",
    musicName: data.musicName ?? "",
    musicArtist: data.musicArtist ?? "",
    musicUrl: data.musicUrl ?? "",
    driveUrl: data.driveUrl ?? "",
    status: data.status ?? "idea",
    publishedUrl: data.publishedUrl ?? "",
    notes: data.notes ?? "",
    createdBy: data.createdBy ?? "",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function serializeContent(
  input: Omit<ContentItem, "id" | "createdAt" | "updatedAt">,
) {
  return {
    ...input,
    productId: input.productId || null,
    campaignId: input.campaignId || null,
    scheduledDate: input.scheduledDate
      ? Timestamp.fromDate(input.scheduledDate)
      : null,
  };
}

export function subscribeContent(callback: (items: ContentItem[]) => void) {
  return onSnapshot(query(contentRef, orderBy("scheduledDate", "asc")), (snapshot) => {
    callback(snapshot.docs.map((item) => mapContent(item.id, item.data())));
  });
}

export async function createContent(
  input: Omit<ContentItem, "id" | "createdAt" | "updatedAt">,
) {
  const payload = serializeContent(input);
  return addDoc(contentRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateContent(
  id: string,
  input: Partial<Omit<ContentItem, "id" | "createdAt" | "updatedAt">>,
) {
  const payload = {
    ...input,
    scheduledDate:
      input.scheduledDate instanceof Date
        ? Timestamp.fromDate(input.scheduledDate)
        : input.scheduledDate,
    productId: input.productId === "" ? null : input.productId,
    campaignId: input.campaignId === "" ? null : input.campaignId,
    updatedAt: serverTimestamp(),
  };
  return updateDoc(doc(db, "contentItems", id), payload);
}

export function deleteContent(id: string) {
  return deleteDoc(doc(db, "contentItems", id));
}

export async function duplicateContent(item: ContentItem, uid: string) {
  const copy: Omit<ContentItem, "id" | "createdAt" | "updatedAt"> = {
    title: item.title,
    scheduledDate: item.scheduledDate,
    postingTime: item.postingTime,
    timezone: item.timezone,
    platforms: item.platforms,
    format: item.format,
    aspectRatio: item.aspectRatio,
    contentType: item.contentType,
    contentPillar: item.contentPillar,
    productId: item.productId,
    campaignId: item.campaignId,
    caption: item.caption,
    cta: item.cta,
    hashtags: item.hashtags,
    musicName: item.musicName,
    musicArtist: item.musicArtist,
    musicUrl: item.musicUrl,
    driveUrl: item.driveUrl,
    status: item.status,
    publishedUrl: item.publishedUrl,
    notes: item.notes,
    createdBy: item.createdBy,
  };
  return createContent({
    ...copy,
    title: `${item.title} Copy`,
    status: item.status === "published" ? "idea" : item.status,
    publishedUrl: "",
    createdBy: uid,
  });
}

export function updateContentDate(id: string, date: Date) {
  return updateContent(id, { scheduledDate: date });
}

export function updateContentStatus(id: string, status: ContentStatus) {
  return updateContent(id, { status });
}
