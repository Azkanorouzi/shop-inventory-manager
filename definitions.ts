import { Types, VirtualType } from "mongoose";

export type RoleType =
  | "CEO"
  | "Manager"
  | "Cashier"
  | "Stock Clerk"
  | "Sales Associate"
  | "Customer Service Representative"
  | "Janitor"
  | "Security Guard"
  | "Marketing Specialist"
  | "Accountant"
  | "Human Resources"
  | "IT Support"
  | "Logistics Coordinator"
  | "Procurement Specialist";

export type ContractType =
  | "Part-time"
  | "Full-time"
  | "Remote-part-time"
  | "Remote-full-time";
export interface CustomError extends Error {
  status?: number;
  syscall?: string;
  code?: string;
}
export interface data {
  createdAt?: Date;
  updatedAt?: Date;
  _id?: Types.ObjectId;
}
export interface Shop extends data {
  img?: string;
  name: string;
  phoneNumber: string;
  location?: {
    type: String;
    coordinates: Number[];
  };
  salesPerMon: number;
  founded: Date;
  opensAt: number;
  closeAt: number;
  // One to many relationship
  categories: Types.ObjectId[];

  workers: Types.ObjectId[];
  sales: Types.ObjectId[];
  numberOfWorkers: Number;

  // virtual
  isOpen?: boolean;
  isLucrative?: boolean;
}

export interface Worker extends data {
  personalInfo: {
    firstName: string;
    lastName: string;
    age: number;
    isMarried: boolean;
  };
  role: RoleType;
  contract: {
    contractType: ContractType;
    startContract: Date;
    endContract: Date;
    salary: number;
  };

  score: number;
  //virtual
  isContractFinished?: Boolean;
  // many to one relationship to shop
  shopId: Types.ObjectId;
  // one to many relationship to sales
  saleId: Types.ObjectId[];
}

export interface Supplier extends data {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  contactPersonaName: string;
  description: string;

  // one to many relationship
  products: Types.ObjectId[];
}

export interface Product extends data {
  productInfo: {
    name: string;
    quantityInStock: number;
    // many to one
    category: Types.ObjectId;
    description: string;
  };
  lastBuy: Date;
  price: number;
  // Out of five
  score: number;
  buyPrice: number;
  supplier: Types.ObjectId;
  shopsId: Types.ObjectId[];
}

export interface Category extends data {
  name: string;
  // virtual
  numProducts?: number;
  products: Types.ObjectId[];
}
export interface Sale extends data {
  // virtual
  profit?: number;
  totalPrice?: number;
  totalSold?: number;
  // Only a few fields must be taken from shopId and workerId
  shopId: Types.ObjectId;
  workerId: Types.ObjectId;
  products: {
    product: Product | Types.ObjectId;
    quantityBought: number;
  }[];
  customerId: Types.ObjectId;
}

export interface Customer extends data {
  name: string;
  email: string;
  phoneNumber: string;
  transactions: Types.ObjectId[];
}
