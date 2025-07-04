// src/controllers/giftController.ts
import { Request, Response } from "express";
import * as GiftModel from "../models/giftModel";

export const listAvailableGifts = async (req: Request, res: Response) => {
  try {
    // Mudando para buscar todos os presentes em vez de apenas os disponíveis
    const gifts = await GiftModel.findAllGifts();
    res.json(gifts);
  } catch (error) {
    console.error("Error listing gifts:", error);
    res.status(500).json({ error: "Erro ao buscar presentes" });
  }
};

export const reserveGift = async (req: Request, res: Response) => {
  const { giftId, guestId } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    const gift = await GiftModel.reserveGift(giftId, guestId);
    res.json(gift);
  } catch (error) {
    console.error("Error reserving gift:", error);
    if (
      error instanceof Error &&
      error.message === "Present not available for reservation"
    ) {
      res
        .status(400)
        .json({ error: "Presente não está disponível para reserva" });
      return;
    }
    res.status(500).json({ error: "Erro ao reservar presente" });
  }
};

export const confirmPurchase = async (req: Request, res: Response) => {
  const { giftId, guestId } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    const gift = await GiftModel.confirmGiftPurchase(giftId, guestId);
    res.json(gift);
  } catch (error) {
    console.error("Error confirming gift purchase:", error);
    if (
      error instanceof Error &&
      error.message ===
        "Present not available for purchase or not reserved by this guest"
    ) {
      res
        .status(400)
        .json({
          error:
            "Presente não está disponível para compra ou não foi reservado por este convidado",
        });
      return;
    }
    res.status(500).json({ error: "Erro ao confirmar compra do presente" });
  }
};
