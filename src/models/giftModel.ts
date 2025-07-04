import pool from "../config/database"; // Certifique-se que database.ts exporta default pool

// Interface para o objeto de presente
interface Gift {
  id: number;
  name: string;
  price: number;
  status: "available" | "reserved" | "purchased";
  guest_id?: number;
}

/**
 * Cria um novo presente no banco de dados
 */
export const createGift = async (
  name: string,
  price: number
): Promise<Gift> => {
  const result = await pool.query(
    "INSERT INTO gifts (name, price, status) VALUES ($1, $2, $3) RETURNING *",
    [name, price, "available"]
  );
  // Adapta o retorno para garantir que o tipo Gift seja completo (opcional, dependendo do retorno exato do DB)
  return result.rows[0];
};

/**
 * Busca todos os presentes disponíveis
 */
export const findAvailableGifts = async (): Promise<Gift[]> => {
  const result = await pool.query(
    "SELECT * FROM gifts WHERE status = $1 ORDER BY name ASC",
    ["available"]
  );
  return result.rows;
};

/**
 * Busca todos os presentes (disponíveis, reservados e comprados)
 */
export const findAllGifts = async (): Promise<Gift[]> => {
  const result = await pool.query("SELECT * FROM gifts ORDER BY name ASC");
  return result.rows;
};

/**
 * Reserva um presente para um convidado
 */
export const reserveGift = async (
  giftId: number,
  guestId: number
): Promise<Gift> => {
  const result = await pool.query(
    "UPDATE gifts SET status = $1, guest_id = $2 WHERE id = $3 AND status = $4 RETURNING *",
    ["reserved", guestId, giftId, "available"]
  );

  if (result.rows.length === 0) {
    throw new Error("Present not available for reservation");
  }

  return result.rows[0];
};

/**
 * Confirma a compra de um presente
 */
export const confirmGiftPurchase = async (
  giftId: number,
  guestId: number
): Promise<Gift> => {
  const result = await pool.query(
    "UPDATE gifts SET status = $1 WHERE id = $2 AND guest_id = $3 AND status = $4 RETURNING *",
    ["purchased", giftId, guestId, "reserved"]
  );

  if (result.rows.length === 0) {
    throw new Error(
      "Present not available for purchase or not reserved by this guest"
    );
  }

  return result.rows[0];
};
