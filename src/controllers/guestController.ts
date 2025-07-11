import { Request, Response } from "express";
import * as guestModel from "../models/guestModel";
import * as emailService from "../utils/mailer";

/**
 * Controller para confirmar presença de um convidado
 */
export const confirmPresence = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullName, email, numCompanions, message } = req.body;

  // Validação básica
  if (
    !fullName ||
    typeof fullName !== "string" ||
    fullName.trim().length === 0
  ) {
    res.status(400).json({
      error: "Nome completo é obrigatório e deve ser uma string válida.",
    });
    return;
  }

  try {
    // Criar o convidado no banco de dados
    const newGuest = await guestModel.createConfirmedGuest(
      fullName.trim(),
      email?.trim() || null,
      numCompanions || null,
      message?.trim() || null
    );

    // Preparar dados para o email
    const guestEmailData = {
      fullName: fullName.trim(),
      email: email?.trim(),
      numCompanions: numCompanions || 0,
      message: message?.trim(),
    };

    // Tentar enviar email de notificação (não bloqueia em caso de erro)
    try {
      await emailService.sendConfirmationNotification(guestEmailData);

      // Opcionalmente, enviar email de confirmação para o convidado
      if (email && email.trim()) {
        await emailService.sendConfirmationToGuest(guestEmailData);
      }
    } catch (emailError) {
      // Log do erro mas não impede a resposta de sucesso
      console.error("Erro ao enviar emails:", emailError);
    }

    res.status(201).json({
      message: "Presença confirmada com sucesso!",
      guest: {
        id: newGuest.id,
        fullName: newGuest.full_name,
        email: newGuest.email,
        numCompanions: newGuest.num_companions,
        message: newGuest.message,
      },
    });
  } catch (error) {
    console.error("Erro ao confirmar presença:", error);
    res.status(500).json({
      error: "Erro interno ao confirmar presença.",
    });
  }
};

/**
 * Controller para buscar todos os convidados confirmados
 */
export const getConfirmedGuests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const confirmedGuests = await guestModel.findConfirmedGuests();
    res.status(200).json({
      guests: confirmedGuests,
      total: confirmedGuests.length,
    });
  } catch (error) {
    console.error("Erro ao buscar confirmados:", error);
    res.status(500).json({
      error: "Erro interno ao buscar convidados confirmados.",
    });
  }
};

/**
 * Controller para buscar todos os convidados não confirmados
 */
export const getUnconfirmedGuests = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const unconfirmedGuests = await guestModel.findUnconfirmedGuests();
    res.status(200).json({
      guests: unconfirmedGuests,
      total: unconfirmedGuests.length,
    });
  } catch (error) {
    console.error("Erro ao buscar não confirmados:", error);
    res.status(500).json({
      error: "Erro interno ao buscar convidados não confirmados.",
    });
  }
};

/**
 * Controller para obter estatísticas dos convidados
 */
export const getGuestStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await guestModel.getGuestStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      error: "Erro interno ao buscar estatísticas dos convidados.",
    });
  }
};

/**
 * Controller para buscar convidado por ID
 */
export const getGuestById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({
      error: "ID do convidado deve ser um número válido.",
    });
    return;
  }

  try {
    const guest = await guestModel.findGuestById(Number(id));

    if (!guest) {
      res.status(404).json({
        error: "Convidado não encontrado.",
      });
      return;
    }

    res.status(200).json({
      guest: {
        id: guest.id,
        fullName: guest.full_name,
        email: guest.email,
        isConfirmed: guest.is_confirmed,
        numCompanions: guest.num_companions,
        message: guest.message,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar convidado:", error);
    res.status(500).json({
      error: "Erro interno ao buscar convidado.",
    });
  }
};
