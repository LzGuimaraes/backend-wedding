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
exports.recordDonation = void 0;
const donationModel = __importStar(require("../models/donationModel"));
const recordDonation = async (req, res) => {
    const { guestId, donationType, amount, donorName, donorMessage } = req.body;
    if (!donationType || !amount || amount < 0) {
        res.status(400).json({ error: 'Invalid donation type or amount.' });
        return;
    }
    if (donationType === 'Lua de Mel' && amount < 100) {
        res.status(400).json({ error: 'Minimum donation for honeymoon is R$100.' });
        return;
    }
    try {
        const newDonation = await donationModel.createDonation(guestId, donationType, amount, donorName, donorMessage);
        res.status(201).json({ message: 'Donation recorded successfully!', donation: newDonation });
    }
    catch (error) {
        console.error('Error recording donation:', error);
        res.status(500).json({ error: 'Internal server error recording donation.' });
    }
};
exports.recordDonation = recordDonation;
//# sourceMappingURL=donationController.js.map