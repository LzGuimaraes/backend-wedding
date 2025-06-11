import { Pool } from 'pg';

// Importando o pool de conexão do banco de dados
const pool = require('../config/database');

// Interface para o objeto de convidado
interface Guest {
    id: number;
    full_name: string;
    is_confirmed: boolean;
}

// Interface para convidados confirmados
interface ConfirmedGuest {
    full_name: string;
}

/**
 * Cria um novo convidado no banco de dados
 */
export const createGuest = async (
    fullName: string, 
    email: string | null, 
    numCompanions: number | null, 
    message: string | null
): Promise<Guest> => {
    const result = await pool.query(
        'INSERT INTO guests (full_name, email, is_confirmed, num_companions, message) VALUES ($1, $2, TRUE, $3, $4) RETURNING id, full_name, is_confirmed',
        [fullName, email, numCompanions, message]
    );
    return result.rows[0];
};

/**
 * Busca todos os convidados confirmados
 */
export const findConfirmedGuests = async (): Promise<ConfirmedGuest[]> => {
    const result = await pool.query('SELECT full_name FROM guests WHERE is_confirmed = TRUE ORDER BY full_name ASC');
    return result.rows;
};