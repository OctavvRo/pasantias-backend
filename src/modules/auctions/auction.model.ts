import mongoose from 'mongoose';
import { Collection } from 'mongodb';
import { Auction } from './auction.interfaces';

const COLLECTION = 'auctions';

export const AuctionModel = {
  collection: (): Collection<Auction> => {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not initialized');
    }

    return db.collection<Auction>(COLLECTION);
  },
};
