export interface Query {
    page: Number,
    limit: Number,
}

export interface QueryString {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  [key: string]: any; // Allow other properties
}