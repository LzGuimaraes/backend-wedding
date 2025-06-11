"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findConfirmedGuests = exports.createGuest = void 0;
// Importando o pool de conexão do banco de dados
const pool = require('../config/database');
/**
 * Cria um novo convidado no banco de dados
 */
const createGuest = async (fullName, email, numCompanions, message) => {
    const result = await pool.query('INSERT INTO guests (full_name, email, is_confirmed, num_companions, message) VALUES ($1, $2, TRUE, $3, $4) RETURNING id, full_name, is_confirmed', [fullName, email, numCompanions, message]);
    return result.rows[0];
};
exports.createGuest = createGuest;
/**
 * Busca todos os convidados confirmados
 */
const findConfirmedGuests = async () => {
    const result = await pool.query('SELECT full_name FROM guests WHERE is_confirmed = TRUE ORDER BY full_name ASC');
    return result.rows;
};
exports.findConfirmedGuests = findConfirmedGuests;
//# sourceMappingURL=guestModel.js.map