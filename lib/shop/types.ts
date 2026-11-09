export type ShopAddress = {
  street: string;
  extra: string;
  postalCode: string;
  city: string;
  province: string;
};

export type Customer = ShopAddress & {
  id: string;
  email: string;
  passwordHash: string;
  phone: string;
  firstName: string;
  lastName: string;
  dni: string;
  createdAt: string;
};

export type PublicCustomer = Omit<Customer, "passwordHash">;

export type LineStock = "pending" | "yes" | "no" | "reserved";

export type OrderLine = {
  productId: string;
  name: string;
  color: string;
  qty: number;
  unitGrossCents: number;
  unitChargeCents: number;
  lineChargeCents: number;
  stock?: LineStock;
  reservePayUrl?: string;
  reservePaymentIntentId?: string;
};

export type OrderStatus =
  | "pending_payment"
  | "authorized"
  | "confirmed"
  | "shipped"
  | "cancelled"
  | "refunded";

export type Order = {
  id: string;
  number: string;
  customerId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dni: string;
  address: ShopAddress;
  lines: OrderLine[];
  exempt: boolean;
  wantsInvoice: boolean;
  goodsGrossCents: number;
  goodsChargeCents: number;
  shippingGrossCents: number;
  shippingChargeCents: number;
  ivaCents: number;
  totalCents: number;
  status: OrderStatus;
  paymentMode: "stripe" | "local";
  stripePaymentIntentId: string;
  invoiceNumber: string;
  invoiceIssuedAt: string;
  creditNumber: string;
  creditIssuedAt: string;
  tracking: string;
  carrier: string;
  createdAt: string;
  authorizedAt: string;
  confirmedAt: string;
  shippedAt: string;
  cancelledAt: string;
  refundedAt: string;
  archivedAt?: string;
};

export type ShopDb = {
  customers: Customer[];
  orders: Order[];
  orderSeq: number;
  invoiceSeq: number;
};

export function emptyShopDb(): ShopDb {
  return { customers: [], orders: [], orderSeq: 0, invoiceSeq: 0 };
}

export function toPublicCustomer(customer: Customer): PublicCustomer {
  return {
    id: customer.id,
    email: customer.email,
    phone: customer.phone,
    firstName: customer.firstName,
    lastName: customer.lastName,
    dni: customer.dni,
    street: customer.street,
    extra: customer.extra,
    postalCode: customer.postalCode,
    city: customer.city,
    province: customer.province,
    createdAt: customer.createdAt,
  };
}
