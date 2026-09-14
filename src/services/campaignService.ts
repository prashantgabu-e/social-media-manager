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
import type { Campaign } from "../types";

const campaignsRef = collection(db, "campaigns");

function mapCampaign(id: string, data: DocumentData): Campaign {
  return {
    id,
    name: data.name ?? "",
    startDate: toDate(data.startDate),
    endDate: toDate(data.endDate),
    objective: data.objective ?? "",
    description: data.description ?? "",
    status: data.status ?? "planned",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function serializeCampaign(input: Omit<Campaign, "id" | "createdAt" | "updatedAt">) {
  return {
    ...input,
    startDate: input.startDate ? Timestamp.fromDate(input.startDate) : null,
    endDate: input.endDate ? Timestamp.fromDate(input.endDate) : null,
  };
}

export function subscribeCampaigns(callback: (campaigns: Campaign[]) => void) {
  return onSnapshot(query(campaignsRef, orderBy("startDate", "desc")), (snapshot) => {
    callback(snapshot.docs.map((item) => mapCampaign(item.id, item.data())));
  });
}

export function createCampaign(
  input: Omit<Campaign, "id" | "createdAt" | "updatedAt">,
) {
  return addDoc(campaignsRef, {
    ...serializeCampaign(input),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateCampaign(
  id: string,
  input: Partial<Omit<Campaign, "id" | "createdAt" | "updatedAt">>,
) {
  return updateDoc(doc(db, "campaigns", id), {
    ...input,
    startDate:
      input.startDate instanceof Date ? Timestamp.fromDate(input.startDate) : input.startDate,
    endDate: input.endDate instanceof Date ? Timestamp.fromDate(input.endDate) : input.endDate,
    updatedAt: serverTimestamp(),
  });
}

export function deleteCampaign(id: string) {
  return deleteDoc(doc(db, "campaigns", id));
}
