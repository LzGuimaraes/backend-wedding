import { Resend } from "resend";

// Inicializa o cliente do Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Interface para dados do convidado no email
interface GuestEmailData {
  fullName: string;
  email?: string;
  numCompanions?: number;
  message?: string;
}

// Função auxiliar para enviar email via Resend
const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const data = await resend.emails.send({
      from: `"Casamento" <onboarding@resend.dev>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email enviado:", data);
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw new Error("Falha ao enviar email");
  }
};

/**
 * Envia email de notificação quando um convidado confirma presença
 */
export const sendConfirmationNotification = async (
  guestData: GuestEmailData
): Promise<void> => {
  const { fullName, email, message } = guestData;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Nova Confirmação de Presença</h2>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Nome:</strong> ${fullName}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
        <p><strong>Mensagem:</strong> ${message || "Nenhuma"}</p>
      </div>
      <p style="text-align: center; color: #666; font-size: 12px;">
        Notificação automática do sistema de confirmação de presença
      </p>
    </div>
  `;

  await sendEmail({
    to: process.env.NOTIFY_EMAIL!,
    subject: "Nova confirmação de presença",
    html,
  });
};

/**
 * Envia email de confirmação diretamente para o convidado (opcional)
 */
export const sendConfirmationToGuest = async (
  guestData: GuestEmailData
): Promise<void> => {
  if (!guestData.email) {
    console.log(
      "Email do convidado não fornecido, pulando envio de confirmação"
    );
    return;
  }

  const { fullName, email } = guestData;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Presença Confirmada!</h2>
      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p>Olá <strong>${fullName}</strong>,</p>
        <p>Sua presença foi confirmada com sucesso!</p>
        <p><strong>Detalhes da confirmação:</strong></p>
        <ul>
          <li>Nome: ${fullName}</li>
        </ul>
        <p>Aguardamos você em nosso grande dia!</p>
      </div>
      <p style="text-align: center; color: #666; font-size: 12px;">
        Este é um email automático, não responda.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Confirmação de Presença Recebida",
    html,
  });
};

// Interface para dados do presente no email
interface GiftEmailData {
  giftName: string;
  giftPrice: number | string;
  guestName: string;
  guestEmail?: string;
  action: "reserva" | "compra";
}

/**
 * Função auxiliar para converter preço para número e formatar
 */
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    console.warn(`Preço inválido recebido: ${price}, usando 0.00`);
    return "0,00";
  }

  return numPrice.toFixed(2).replace(".", ",");
};

/**
 * Envia email de notificação para reserva ou compra de presente
 */
export const sendGiftReservationNotification = async (
  giftData: GiftEmailData
): Promise<void> => {
  const { giftName, giftPrice, guestName, guestEmail, action } = giftData;

  const actionText = action === "reserva" ? "Reservou" : "Comprou";
  const actionColor = action === "reserva" ? "#ff9500" : "#28a745";

  const formattedPrice = formatPrice(giftPrice);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; text-align: center;">Presente ${actionText}!</h2>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${actionColor};">
        <h3 style="color: ${actionColor}; margin-top: 0;">Informações do Presente:</h3>
        <p><strong>Presente:</strong> ${giftName}</p>
        <p><strong>Valor:</strong> R$ ${formattedPrice}</p>
        <p><strong>Ação:</strong> ${actionText}</p>
        
        <h3 style="color: #333; margin-top: 20px;">Informações do Convidado:</h3>
        <p><strong>Nome:</strong> ${guestName}</p>
        ${guestEmail ? `<p><strong>Email:</strong> ${guestEmail}</p>` : ""}
      </div>
      <p style="text-align: center; color: #666; font-size: 12px;">
        Notificação automática do sistema de lista de presentes
      </p>
    </div>
  `;

  await sendEmail({
    to: process.env.NOTIFY_EMAIL!,
    subject: `${actionText} Presente - ${giftName}`,
    html,
  });
};
