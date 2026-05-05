import { ObjectId } from 'mongodb';
import { BidModel } from './bids.model';
import { AuctionModel } from '../auctions/auction.model';

export const BidService = {
  async findByAuctionId(auctionId: string) {
    return BidModel.collection()
      .find({ auctionId: new ObjectId(auctionId) })
      .sort({ date: -1 })
      .toArray();
  },

  async placeBid(auctionId: string, userId: string, amount: number) {
    const auction = await AuctionModel.collection().findOne({
      _id: new ObjectId(auctionId),
    });

    if (!auction) throw new Error("Subasta no encontrada");

    if (auction.status === "CLOSED" || auction.status === "CANCELLED") {
      throw new Error("Subasta no activa");
    }

    if (amount <= auction.currentPrice) {
      throw new Error("Oferta inválida");
    }

    // insertar bid
    await BidModel.collection().insertOne({
      auctionId: auction._id!,
      userId: new ObjectId(userId),
      amount,
      date: new Date(),
    });

    // actualizar subasta
    await AuctionModel.collection().updateOne(
      { _id: auction._id },
      {
        $set: {
          currentPrice: amount,
          winnerId: new ObjectId(userId),
        },
        $inc: { bidsCount: 1 },
      }
    );

    return { message: "Oferta realizada" };
  },
};
