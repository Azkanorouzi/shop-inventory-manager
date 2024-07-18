import { Types, VirtualType } from "mongoose";

export type contractType = "part-time" | "full-time" | "remote-part-time" | "remote-full-time"; 
export interface CustomError extends Error {
  status?: number;
  syscall?: string;
  code?: string;
}
export interface data {
  createdAt: Date,
  updatedAt: Date,
}
export interface Shop extends data {
  name: string,
  phoneNumber: string,
  location?: Geolocation,
  salesPerMon: number,
  founded: Date,
  // one to many to categories, and workers and sales
  categories: Types.ObjectId[],
  workers: Types.ObjectId[],
  sales: Types.ObjectId[]

  // virtual
  isOpen?: boolean,
  isLucrative?: boolean
}


export interface worker extends data {
  personalInfo: {
    firstName: string,
    lastName: string,
    age: number,
    isMarried: boolean,
  },
  role: string,
  contract: {
    contractType: contractType,
    startContract: Date,
    endContract: Date,
    salary: number,
  }

  score: number,
  //virtual
  isContractFinished: Boolean
  // many to one relationship to shop
  shopId: Types.ObjectId,
  // one to many relationship to sales
  saleId: Types.ObjectId[],
}

export interface Supplier extends data {
  name: string,
  phoneNumber: string,
  email: string,
  address: string,
  contactPersonaName: string,
  description: string,

  // one to many relationship
  products: Types.ObjectId[],
}

export interface Product extends data {
  productInfo: {
    name: string,
    quantity: number,
    // many to one
    category: Types.ObjectId
    description: string,
  }
  lastBuy: Date
  price: number,
  // Out of five
  score: number,
  buyPrice: number,
  supplier: Types.ObjectId,
  shopId: Types.ObjectId[],
}

export interface Category extends data {
  name: string,
  // virtual
  numProducts?: number,
  products: Types.ObjectId[]
}
export interface Sale extends data { 
  totalPrice: number,
  totalSold: number,
  // virtual
  profit?: number,
  // Only a few fields must be taken from shopId and workerId
  shopId: Types.ObjectId,
  workerId: Types.ObjectId,
  // TODO:
  // products: {product: , id: }[],
  customerId: Types.ObjectId,
}

export interface Customer extends data {
  name: string,
  email: string,
  phoneNumber: string,
  transactions: Types.ObjectId[]
}
