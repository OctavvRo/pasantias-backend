import express, { Router } from 'express';
import { auth } from '../../modules/auth';
import { validate } from '../../modules/validate';
import { BidController, bidsValidation } from '../../modules/bids';

const router: Router = express.Router();

router
  .route('/auction/:auctionId')
  .get(auth(), validate(bidsValidation.getByAuction), BidController.getByAuction);

router.route('/').post(auth(), validate(bidsValidation.placeBid), BidController.placeBid);

export default router;
