import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { AuctionController, auctionValidation } from '../../modules/auctions';

const router: Router = express.Router();

router
  .route('/')
  .post(auth(), validate(auctionValidation.createAuction), AuctionController.create)
  .get(auth(), AuctionController.getAll);

export default router;
