import { ObjectId } from "mongodb";

export interface Bid {
  _id?: ObjectId;
  auctionId: ObjectId;
  userId: ObjectId;
  amount: number;
  date: Date;
}
