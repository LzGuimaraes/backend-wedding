import { Router } from "express";
import * as GiftController from "../controllers/giftController";
import asyncHandler from "express-async-handler";

const router = Router();

// Rota para listar presentes disponíveis
router.get("/", asyncHandler(GiftController.listAvailableGifts));

// Rota para reservar um presente
router.post("/reserve", asyncHandler(GiftController.reserveGift));

// Rota para confirmar a compra de um presente
router.post("/purchase", asyncHandler(GiftController.confirmPurchase));

export default router;
