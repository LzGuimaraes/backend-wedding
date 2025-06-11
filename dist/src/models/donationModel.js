"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDonation = void 0;
// Importando o pool de conexão do banco de dados
const pool = require('../config/database');
/**
 * Cria uma nova doação no banco de dados
 */
const createDonation = async (guestId, donationType, amount, donorName, donorMessage) => {
    const result = await pool.query('INSERT INTO donations (guest_id, donation_type, amount, donor_name, donor_message) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, donation_type', [guestId, donationType, amount, donorName, donorMessage]);
    return result.rows[0];
};
exports.createDonation = createDonation;
//# sourceMappingURL=donationModel.js.map