import { Request, Response } from 'express';
import { AuctionService } from './auction.service';

export const AuctionController = {
  async create(req: Request, res: Response) {
    const result = await AuctionService.create({
      ...req.body,
      sellerId: req.user.id,
    });
    res.json(result);
  },

  async getAll(_req: Request, res: Response) {
    const auctions = await AuctionService.findAll();
    res.json(auctions);
  },
};
