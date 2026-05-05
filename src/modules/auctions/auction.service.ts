import { ObjectId } from "mongodb";
import { AuctionModel } from "./auction.model";
import { Auction } from "./auction.interfaces";

export const AuctionService = {
  async create(data: {
    productId: string;
    sellerId: string;
    startingPrice: number;
    startDate: Date | string;
    endDate: Date | string;
  }) {
    const auction: Auction = {
      productId: new ObjectId(data.productId),
      sellerId: new ObjectId(data.sellerId),
      startingPrice: data.startingPrice,
      currentPrice: data.startingPrice,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "ACTIVE",
      winnerId: null,
      bidsCount: 0,
    };

    const result = await AuctionModel.collection().insertOne(auction);
    return result;
  },

  async findAll() {
    return AuctionModel.collection().find().toArray();
  },

  async findById(id: string) {
    return AuctionModel.collection().findOne({ _id: new ObjectId(id) });
  },

  async closeExpired() {
    return AuctionModel.collection().updateMany(
      {
        status: "ACTIVE",
        endDate: { $lte: new Date() },
      },
      {
        $set: { status: "CLOSED" },
      }
    );
  },
};
