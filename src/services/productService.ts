import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { toDate } from "./firestoreMappers";
import type { Product } from "../types";

const productsRef = collection(db, "products");

function mapProduct(id: string, data: DocumentData): Product {
  return {
    id,
    name: data.name ?? "",
    sku: data.sku ?? "",
    collection: data.collection ?? "",
    category: data.category ?? "",
    gender: data.gender ?? "",
    productUrl: data.productUrl ?? "",
    status: data.status ?? "active",
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

export function subscribeProducts(callback: (products: Product[]) => void) {
  return onSnapshot(query(productsRef, orderBy("name", "asc")), (snapshot) => {
    callback(snapshot.docs.map((item) => mapProduct(item.id, item.data())));
  });
}

export function createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">) {
  return addDoc(productsRef, {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateProduct(
  id: string,
  input: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>,
) {
  return updateDoc(doc(db, "products", id), {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

export function deleteProduct(id: string) {
  return deleteDoc(doc(db, "products", id));
}
