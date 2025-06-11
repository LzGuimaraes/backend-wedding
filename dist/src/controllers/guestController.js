"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfirmedGuests = exports.confirmPresence = void 0;
const guestModel = __importStar(require("../models/guestModel"));
// Confirma a presença de um convidado
const confirmPresence = async (req, res) => {
    const { fullName, email, numCompanions, message } = req.body;
    // Validação básica (pode ser mais robusta com Joi/Yup)
    if (!fullName) {
        res.status(400).json({ error: 'Full name is required.' });
        return;
    }
    try {
        const newGuest = await guestModel.createGuest(fullName, email, numCompanions, message);
        res.status(201).json({ message: 'Presence confirmed successfully!', guest: newGuest });
    }
    catch (error) {
        console.error('Error confirming presence:', error);
        res.status(500).json({ error: 'Internal server error confirming presence.' });
    }
};
exports.confirmPresence = confirmPresence;
const getConfirmedGuests = async (req, res) => {
    try {
        const confirmedGuests = await guestModel.findConfirmedGuests();
        res.status(200).json(confirmedGuests);
    }
    catch (error) {
        console.error('Error fetching confirmed guests:', error);
        res.status(500).json({ error: 'Internal server error fetching guests.' });
    }
};
exports.getConfirmedGuests = getConfirmedGuests;
//# sourceMappingURL=guestController.js.map