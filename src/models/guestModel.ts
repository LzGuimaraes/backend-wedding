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

// Interface para dados de criação de convidado
interface CreateGuestData {
  fullName: string;
  email?: string | null;
  numCompanions?: number | null;
  message?: string | null;
  isConfirmed?: boolean;
}

/**
 * Cria um novo convidado no banco de dados
 */
export const createGuest = async (
  guestData: CreateGuestData
): Promise<Guest> => {
  const {
    fullName,
    email,
    numCompanions,
    message,
    isConfirmed = true,
  } = guestData;

  const result = await pool.query(
    "INSERT INTO guests (full_name, email, is_confirmed, num_companions, message) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, is_confirmed, email, num_companions, message",
    [
      fullName,
      email || null,
      isConfirmed,
      numCompanions || null,
      message || null,
    ]
  );

  return result.rows[0];
};

/**
 * Cria um novo convidado já confirmado (método conveniente para confirmação de presença)
 */
export const createConfirmedGuest = async (
  fullName: string,
  email?: string | null,
  numCompanions?: number | null,
  message?: string | null
): Promise<Guest> => {
  return createGuest({
    fullName,
    email,
    numCompanions,
    message,
    isConfirmed: true,
  });
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
 * Busca todos os convidados não confirmados
 */
export const findUnconfirmedGuests = async (): Promise<ConfirmedGuest[]> => {
  const result = await pool.query(
    "SELECT id, full_name, email FROM guests WHERE is_confirmed = FALSE ORDER BY full_name ASC"
  );
  return result.rows;
};

/**
 * Busca convidado por ID
 */
export const findGuestById = async (id: number): Promise<Guest | null> => {
  const result = await pool.query(
    "SELECT id, full_name, is_confirmed, email, num_companions, message FROM guests WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Busca convidado por email
 */
export const findGuestByEmail = async (
  email: string
): Promise<Guest | null> => {
  const result = await pool.query(
    "SELECT id, full_name, is_confirmed, email, num_companions, message FROM guests WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Atualiza status de confirmação de um convidado
 */
export const updateGuestConfirmation = async (
  id: number,
  isConfirmed: boolean
): Promise<Guest | null> => {
  const result = await pool.query(
    "UPDATE guests SET is_confirmed = $1 WHERE id = $2 RETURNING id, full_name, is_confirmed, email, num_companions, message",
    [isConfirmed, id]
  );
  return result.rows[0] || null;
};

/**
 * Obtém estatísticas dos convidados
 */
export const getGuestStats = async (): Promise<{
  total: number;
  confirmed: number;
  unconfirmed: number;
  totalCompanions: number;
}> => {
  const result = await pool.query(`
    SELECT 
      COUNT(*) as total,
      COUNT(CASE WHEN is_confirmed = TRUE THEN 1 END) as confirmed,
      COUNT(CASE WHEN is_confirmed = FALSE THEN 1 END) as unconfirmed,
      COALESCE(SUM(CASE WHEN is_confirmed = TRUE THEN num_companions ELSE 0 END), 0) as total_companions
    FROM guests
  `);

  const stats = result.rows[0];
  return {
    total: parseInt(stats.total),
    confirmed: parseInt(stats.confirmed),
    unconfirmed: parseInt(stats.unconfirmed),
    totalCompanions: parseInt(stats.total_companions),
  };
};

export type { Guest, ConfirmedGuest, CreateGuestData };
