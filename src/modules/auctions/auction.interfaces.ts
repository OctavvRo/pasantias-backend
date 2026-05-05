import { ObjectId } from "mongodb";

export interface Auction {
  _id?: ObjectId;
  productId: ObjectId;
  sellerId: ObjectId;
  startingPrice: number;
  currentPrice: number;
  startDate: Date;
  endDate: Date;
  status: "ACTIVE" | "CLOSED" | "CANCELLED";
  winnerId?: ObjectId | null;
  bidsCount: number;
}
