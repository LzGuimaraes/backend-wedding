import { Request, Response } from "express";
import * as GiftModel from "../models/giftModel";
import * as emailService from "../utils/mailer";

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
  const { giftId, guestId, guestName, guestEmail } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    const gift = await GiftModel.reserveGift(giftId, guestId);

    // Enviar email de notificação de reserva
    try {
      await emailService.sendGiftReservationNotification({
        giftName: gift.name,
        giftPrice: gift.price,
        guestName: guestName || `Convidado ${guestId}`,
        guestEmail: guestEmail,
        action: "reserva",
      });
    } catch (emailError) {
      console.error("Erro ao enviar email de reserva:", emailError);
      // Não impede a resposta de sucesso
    }

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
  const { giftId, guestId, guestName, guestEmail } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    const gift = await GiftModel.confirmGiftPurchase(giftId, guestId);

    // Enviar email de notificação de compra
    try {
      await emailService.sendGiftReservationNotification({
        giftName: gift.name,
        giftPrice: gift.price,
        guestName: guestName || `Convidado ${guestId}`,
        guestEmail: guestEmail,
        action: "compra",
      });
    } catch (emailError) {
      console.error("Erro ao enviar email de compra:", emailError);
      // Não impede a resposta de sucesso
    }

    res.json(gift);
  } catch (error) {
    console.error("Error confirming gift purchase:", error);
    if (
      error instanceof Error &&
      error.message ===
        "Present not available for purchase or not reserved by this guest"
    ) {
      res.status(400).json({
        error:
          "Presente não está disponível para compra ou não foi reservado por este convidado",
      });
      return;
    }
    res.status(500).json({ error: "Erro ao confirmar compra do presente" });
  }
};
