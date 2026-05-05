import { Request, Response } from 'express';
import { BidService } from './bids.service';

export const BidController = {
  async getByAuction(req: Request, res: Response) {
    try {
      const { auctionId } = req.params;
      if (!auctionId) {
        return res.status(400).json({ error: "Falta auctionId." });
      }

      const bids = await BidService.findByAuctionId(auctionId);

      return res.json(bids);
    } catch (error: any) {
      console.error("Error al obtener las pujas:", error.message);

      return res.status(400).json({ error: error.message });
    }
  },

  async placeBid(req: Request, res: Response) {
    try {
      console.log("Body recibido desde Angular:", req.body);

      const { auctionId, userId, amount } = req.body;

      if (!auctionId || !userId || !amount) {
        // Camino 1: Retorna un error
        return res.status(400).json({ 
          error: "Faltan datos requeridos. Revisa que estés enviando auctionId, userId y amount." 
        });
      }

      const result = await BidService.placeBid(auctionId, userId, amount);
      
      // Camino 2 (CORREGIDO): Agregamos 'return' al éxito
      return res.status(201).json(result);

    } catch (error: any) {
      console.error("Error al crear la puja:", error.message);
      
      // Camino 3 (CORREGIDO): Agregamos 'return' al catch
      return res.status(400).json({ error: error.message });
    }
  },
};
