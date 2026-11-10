import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { newId } from "@/lib/portal/crypto";
import { emptyShopDb, type Customer, type Order, type ShopDb } from "./types";

const DB_PATH = "shop/db.json";
const ROOT = path.join(process.cwd(), "data");

function useBlob() {
  return process.env.NODE_ENV === "production" && Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function asDb(value: Partial<ShopDb> | null): ShopDb {
  if (!value) return emptyShopDb();
  return {
    customers: Array.isArray(value.customers) ? value.customers : [],
    orders: Array.isArray(value.orders) ? value.orders : [],
    orderSeq: typeof value.orderSeq === "number" ? value.orderSeq : 0,
    invoiceSeq: typeof value.invoiceSeq === "number" ? value.invoiceSeq : 0,
  };
}

async function readDb(): Promise<ShopDb> {
  if (useBlob()) {
    try {
      const result = await get(DB_PATH, { access: "private", useCache: false });
      if (!result) return emptyShopDb();
      const text = await new Response(result.stream).text();
      return asDb(JSON.parse(text) as ShopDb);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (/does not exist/i.test(message)) return emptyShopDb();
      throw err;
    }
  }
  try {
    const raw = await readFile(path.join(ROOT, DB_PATH), "utf8");
    return asDb(JSON.parse(raw) as ShopDb);
  } catch {
    return emptyShopDb();
  }
}

async function writeDb(db: ShopDb) {
  const body = JSON.stringify(db, null, 2);
  if (useBlob()) {
    await put(DB_PATH, body, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const file = path.join(ROOT, DB_PATH);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, body, "utf8");
}

export async function mutateShop<T>(fn: (db: ShopDb) => T) {
  const db = await readDb();
  const result = fn(db);
  await writeDb(db);
  return result;
}

export function nextNumber(seq: number, prefix: string) {
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${String(seq).padStart(4, "0")}`;
}

export async function getCustomer(id: string) {
  const db = await readDb();
  return db.customers.find((customer) => customer.id === id) ?? null;
}

export async function getCustomerByEmail(email: string) {
  const db = await readDb();
  return db.customers.find((customer) => customer.email === email) ?? null;
}

export async function insertCustomer(customer: Customer) {
  await mutateShop((db) => {
    db.customers.push(customer);
  });
}

export async function saveCustomer(customer: Customer) {
  await mutateShop((db) => {
    const index = db.customers.findIndex((item) => item.id === customer.id);
    if (index >= 0) db.customers[index] = customer;
  });
}

export async function deleteCustomers(ids: string[]) {
  const wanted = new Set(ids.filter(Boolean));
  if (!wanted.size) return 0;
  return mutateShop((db) => {
    const before = db.customers.length;
    db.customers = db.customers.filter((customer) => !wanted.has(customer.id));
    return before - db.customers.length;
  });
}

export async function getOrder(id: string) {
  const db = await readDb();
  return db.orders.find((order) => order.id === id) ?? null;
}

export async function listCustomers() {
  const db = await readDb();
  return [...db.customers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listOrders() {
  const db = await readDb();
  return [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listOrdersByCustomer(customerId: string) {
  const orders = await listOrders();
  return orders.filter((order) => order.customerId === customerId);
}

export function freshId() {
  return newId();
}

export type { Order };
