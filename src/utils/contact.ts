/**
 * Utilitários para contato com clientes via WhatsApp e Email
 */

export interface ContactTemplateData {
  clientName: string;
  userName?: string;
}

/**
 * Formata número de telefone brasileiro para uso no WhatsApp
 * Converte formatos como "(11) 99999-9999" para "5511999999999"
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  if (!phone) return '';
  
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se já começar com 55 (código do Brasil), retorna como está
  if (cleanPhone.startsWith('55')) {
    return cleanPhone;
  }
  
  // Adiciona código do Brasil (55)
  return `55${cleanPhone}`;
};

/**
 * Gera template de mensagem para WhatsApp
 */
export const generateWhatsAppMessage = (data: ContactTemplateData): string => {
  const { clientName, userName = '' } = data;
  
  return `Olá ${clientName}!

Espero que esteja bem! 

Sobre sua importação marítima, gostaria de verificar alguns detalhes do processo.

Podemos conversar quando for conveniente para você?

Atenciosamente,${userName ? '\n' + userName : ''}`;
};

/**
 * Gera template de assunto para email
 */
export const generateEmailSubject = (clientName: string): string => {
  return `Importação Marítima - ${clientName}`;
};

/**
 * Gera template de corpo para email
 */
export const generateEmailBody = (data: ContactTemplateData): string => {
  const { clientName, userName = '' } = data;
  
  return `Olá ${clientName},

Espero que esteja bem.

Entro em contato sobre o processo de importação marítima para verificar alguns detalhes e alinhar os próximos passos.

Gostaria de agendar uma conversa para discutirmos as especificidades do seu projeto.

Fico à disposição para esclarecer qualquer dúvida.

Atenciosamente,${userName ? '\n' + userName : ''}`;
};

/**
 * Abre WhatsApp com mensagem pré-definida
 */
export const openWhatsApp = (phone: string, message: string): void => {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  
  window.open(url, '_blank');
};

/**
 * Abre cliente de email com dados pré-preenchidos
 */
export const openEmail = (email: string, subject: string, body: string): void => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const url = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
  
  window.open(url, '_self');
};

/**
 * Valida se um número de telefone é válido para WhatsApp
 */
export const isValidPhoneForWhatsApp = (phone: string): boolean => {
  if (!phone) return false;
  
  const cleanPhone = phone.replace(/\D/g, '');
  // Telefone brasileiro: 10 dígitos (DDD + 8) ou 11 dígitos (DDD + 9)
  // Exemplos: 1199999999 (10) ou 11999999999 (11)
  return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

/**
 * Valida se um email é válido
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};