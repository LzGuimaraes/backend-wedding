import nodemailer from "nodemailer";

// Interface para dados do convidado no email
interface GuestEmailData {
  fullName: string;
  email?: string;
  numCompanions?: number;
  message?: string;
}

// Configuração do transporter do Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Envia email de notificação quando um convidado confirma presença
 */
export const sendConfirmationNotification = async (
  guestData: GuestEmailData
): Promise<void> => {
  const transporter = createTransporter();

  const { fullName, email, message } = guestData;

  const mailOptions = {
    from: `"Casamento" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL, // pode conter múltiplos e-mails separados por vírgula
    subject: "Nova confirmação de presença",
    html: `
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de notificação enviado para confirmação de ${fullName}`);
  } catch (error) {
    console.error("Erro ao enviar email de notificação:", error);
    throw new Error("Falha ao enviar email de notificação");
  }
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

  const transporter = createTransporter();
  const { fullName, email } = guestData;

  const mailOptions = {
    from: `"Casamento" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Confirmação de Presença Recebida",
    html: `
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de confirmação enviado para ${email}`);
  } catch (error) {
    console.error("Erro ao enviar email de confirmação ao convidado:", error);
    // Não lança erro aqui para não interromper o processo principal
  }
};

// Interface para dados do presente no email
interface GiftEmailData {
  giftName: string;
  giftPrice: number | string; // Aceita tanto number quanto string
  guestName: string;
  guestEmail?: string;
  action: "reserva" | "compra";
}

/**
 * Função auxiliar para converter preço para número e formatar
 */
const formatPrice = (price: number | string): string => {
  // Converte para número se for string
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Verifica se é um número válido
  if (isNaN(numPrice)) {
    console.warn(`Preço inválido recebido: ${price}, usando 0.00`);
    return "0,00";
  }

  // Formata o preço para o padrão brasileiro
  return numPrice.toFixed(2).replace(".", ",");
};

/**
 * Envia email de notificação para reserva ou compra de presente
 */
export const sendGiftReservationNotification = async (
  giftData: GiftEmailData
): Promise<void> => {
  const transporter = createTransporter();
  const { giftName, giftPrice, guestName, guestEmail, action } = giftData;

  const actionText = action === "reserva" ? "Reservou" : "Comprou";
  const actionColor = action === "reserva" ? "#ff9500" : "#28a745";

  // Formata o preço de forma segura
  const formattedPrice = formatPrice(giftPrice);

  const mailOptions = {
    from: `"Casamento" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `${actionText} Presente - ${giftName}`,
    html: `
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
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de notificação de ${action} enviado para ${giftName}`);
  } catch (error) {
    console.error(`Erro ao enviar email de notificação de ${action}:`, error);
    throw new Error(`Falha ao enviar email de notificação de ${action}`);
  }
};
