// src/controllers/giftController.ts
import { Request, Response } from 'express';
import * as GiftModel from '../models/giftModel';

export const listAvailableGifts = async (req: Request, res: Response) => { // <-- Removido ': Promise<Response>'
    try {
        const gifts = await GiftModel.findAvailableGifts();
        res.json(gifts); // Não precisa de 'return' aqui se você já enviou a resposta
    } catch (error) {
        console.error("Error listing available gifts:", error);
        res.status(500).json({ error: 'Erro ao buscar presentes disponíveis' });
    }
};

export const reserveGift = async (req: Request, res: Response) => { // <-- Removido ': Promise<Response>'
    const { giftId, guestId } = req.body;

    if (!giftId || !guestId) {
        res.status(400).json({ error: 'ID do presente e do convidado são obrigatórios' });
    }

    try {
        const gift = await GiftModel.reserveGift(giftId, guestId);
        res.json(gift); 
    } catch (error) {
        console.error("Error reserving gift:", error);
        if (error instanceof Error && error.message === 'Present not available for reservation') {
            res.status(400).json({ error: 'Presente não está disponível para reserva' });
        }
        res.status(500).json({ error: 'Erro ao reservar presente' });
    }
};

export const confirmPurchase = async (req: Request, res: Response) => { // <-- Removido ': Promise<Response>'
    const { giftId, guestId } = req.body;

    if (!giftId || !guestId) {
        res.status(400).json({ error: 'ID do presente e do convidado são obrigatórios' });
    }

    try {
        const gift = await GiftModel.confirmGiftPurchase(giftId, guestId);
        res.json(gift); 
    } catch (error) {
        console.error("Error confirming gift purchase:", error);
        if (error instanceof Error && error.message === 'Present not available for purchase or not reserved by this guest') {
            res.status(400).json({ error: 'Presente não está disponível para compra ou não foi reservado por este convidado' });
        }
        res.status(500).json({ error: 'Erro ao confirmar compra do presente' });
    }
};