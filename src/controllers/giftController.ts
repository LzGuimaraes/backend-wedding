import { Request, Response } from "express";
import * as GiftModel from "../models/giftModel";
import * as emailService from "../utils/mailer";

export const listAvailableGifts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const gifts = await GiftModel.findAllGifts();
    res.json(gifts);
  } catch (error) {
    console.error("Error listing gifts:", error);
    res.status(500).json({ error: "Erro ao buscar presentes" });
  }
};

export const reserveGift = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { giftId, guestId, guestName, guestEmail } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    // Buscar dados do presente antes de reservar
    const giftData = await GiftModel.findGiftById(giftId);

    if (!giftData) {
      res.status(404).json({ error: "Presente não encontrado" });
      return;
    }

    // Reservar o presente
    const gift = await GiftModel.reserveGift(giftId, guestId);

    // Enviar email de notificação de reserva
    try {
      await emailService.sendGiftReservationNotification({
        giftName: gift.name,
        giftPrice: gift.price,
        guestName: guestName || `Convidado ${guestId}`,
        guestEmail: guestEmail || undefined,
        action: "reserva",
      });

      console.log(
        `Email de reserva enviado com sucesso - Presente: ${gift.name} - Convidado: ${guestName} - Email notificação: ${process.env.NOTIFY_EMAIL}`
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de reserva:", emailError);
      // Não impede a resposta de sucesso, mas loga o erro
    }

    res.json({
      message: "Presente reservado com sucesso!",
      gift: gift,
    });
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

export const confirmPurchase = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { giftId, guestId, guestName, guestEmail } = req.body;

  if (!giftId || !guestId) {
    res
      .status(400)
      .json({ error: "ID do presente e do convidado são obrigatórios" });
    return;
  }

  try {
    // Buscar dados do presente antes de confirmar compra
    const giftData = await GiftModel.findGiftById(giftId);

    if (!giftData) {
      res.status(404).json({ error: "Presente não encontrado" });
      return;
    }

    // Confirmar a compra do presente
    const gift = await GiftModel.confirmGiftPurchase(giftId, guestId);

    // Enviar email de notificação de compra
    try {
      await emailService.sendGiftReservationNotification({
        giftName: gift.name,
        giftPrice: gift.price,
        guestName: guestName || `Convidado ${guestId}`,
        guestEmail: guestEmail || undefined,
        action: "compra",
      });

      console.log(
        `Email de compra enviado com sucesso - Presente: ${gift.name} - Convidado: ${guestName} - Email notificação: ${process.env.NOTIFY_EMAIL}`
      );
    } catch (emailError) {
      console.error("Erro ao enviar email de compra:", emailError);
      // Não impede a resposta de sucesso, mas loga o erro
    }

    res.json({
      message: "Compra confirmada com sucesso!",
      gift: gift,
    });
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
