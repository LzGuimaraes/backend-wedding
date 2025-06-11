import { Pool } from 'pg';
import { PoolClient } from 'pg';

// Importando o pool de conexão do banco de dados
const pool = require('../config/database');

// Interface para o objeto de doação
interface Donation {
    id: number;
    amount: number;
    donation_type: string;
}

/**
 * Cria uma nova doação no banco de dados
 */
export const createDonation = async (
    guestId: number | null, 
    donationType: string, 
    amount: number, 
    donorName: string, 
    donorMessage: string | null
): Promise<Donation> => {
    const result = await pool.query(
        'INSERT INTO donations (guest_id, donation_type, amount, donor_name, donor_message) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, donation_type',
        [guestId, donationType, amount, donorName, donorMessage]
    );
    return result.rows[0];
};