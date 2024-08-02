import { Query, Document } from "mongoose";
import { QueryString } from "./definitions";

export class ResponseTransformer<T extends Document> {
  public query: Query<
    Document[],
    Document,
    {},
    Document,
    "find",
    Record<string, never>
  >;
  private queryString: QueryString;
  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }
  implementFilter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];

    excludedFields.forEach((el) => delete queryObject["page"]);

    let queryStr = JSON.stringify(queryObject);

    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    // To enable daisy chaining
    return this;
  }

  implementSort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replaceAll(",", " ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  implementPagination() {
    const page = Number(this.queryString.page);
    const limit = Number(this.queryString.limit) || 6;

    const skip = limit * (page - 1);

    this.query.skip(skip).limit(limit);

    return this;
  }

  implementProjection() {
    if (this.queryString.fields) {
      const sortBy = this.queryString;

      this.query = this.query.select(sortBy);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
}
