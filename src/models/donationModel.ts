// Importando a instância do pool de conexão do banco de dados configurada em src/config/database.ts
import pool from "../config/database"; // Certifique-se que database.ts exporta default pool

// Interface para o objeto de doação
interface Donation {
  id: number;
  amount: number;
  donation_type: string;
  // Adicione outros campos que podem ser retornados ou usados consistentemente
  guest_id?: number | null;
  donor_name?: string;
  donor_message?: string | null;
  // donation_date: Date; // Adicione se for retornar
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
    "INSERT INTO donations (guest_id, donation_type, amount, donor_name, donor_message) VALUES ($1, $2, $3, $4, $5) RETURNING id, amount, donation_type, guest_id, donor_name, donor_message",
    [guestId, donationType, amount, donorName, donorMessage]
  );
  // Adapta o retorno para garantir que o tipo Donation seja completo
  return result.rows[0];
};
