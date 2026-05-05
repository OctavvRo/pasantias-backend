import mongoose from 'mongoose';
import { Collection } from 'mongodb';
import { Bid } from './bids.interfaces';

const COLLECTION = 'bids';

export const BidModel = {
  collection: (): Collection<Bid> => {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection is not initialized');
    }

    return db.collection<Bid>(COLLECTION);
  },
};
