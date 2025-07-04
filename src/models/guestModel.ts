// Importando a instância do pool de conexão do banco de dados configurada em src/config/database.ts
import pool from "../config/database";

// Interface para o objeto de convidado
interface Guest {
  id: number;
  full_name: string;
  is_confirmed: boolean;
  email: string | null;
  num_companions: number | null;
  message: string | null;
}

// Interface para convidados confirmados
interface ConfirmedGuest {
  id: number;
  full_name: string;
  email: string | null;
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
    "INSERT INTO guests (full_name, email, is_confirmed, num_companions, message) VALUES ($1, $2, TRUE, $3, $4) RETURNING id, full_name, is_confirmed, email, num_companions, message",
    [fullName, email, numCompanions, message]
  );
  // Adapta o retorno para incluir todos os campos da interface Guest
  return result.rows[0];
};

/**
 * Busca todos os convidados confirmados
 */
export const findConfirmedGuests = async (): Promise<ConfirmedGuest[]> => {
  const result = await pool.query(
    "SELECT id, full_name, email FROM guests WHERE is_confirmed = TRUE ORDER BY full_name ASC"
  );
  return result.rows;
};

/**
 * Busca todos os convidados Não confirmados
 */
export const findUnconfirmedGuests = async (): Promise<ConfirmedGuest[]> => {
  const result = await pool.query(
    "SELECT id, full_name, email FROM guests WHERE is_confirmed = FALSE ORDER BY full_name ASC"
  );
  return result.rows;
};
