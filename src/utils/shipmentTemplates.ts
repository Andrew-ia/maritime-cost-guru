/**
 * Templates personalizados para envio de orçamentos via WhatsApp e Email
 */

import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';

export interface ShipmentTemplateData {
  clientName: string;
  calculationName: string;
  userName?: string;
  pdfUrl: string;
  dados: DadosImportacao;
  resultados: ResultadosCalculados;
}

/**
 * Formata valor monetário para exibição
 */
const formatCurrency = (value: number, currency: 'BRL' | 'USD' = 'BRL'): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Gera template de mensagem para WhatsApp com orçamento
 */
export const generateShipmentWhatsAppMessage = (data: ShipmentTemplateData): string => {
  const { clientName, calculationName, userName = '', dados, resultados, pdfUrl } = data;
  
  return `Olá ${clientName}! 📋

Segue o orçamento da sua importação marítima:

*${calculationName}*

📦 *Resumo da Operação:*
• Produto: ${dados.produto || 'Não informado'}
• Origem: ${dados.origem || 'Não informado'}
• Destino: ${dados.destino || 'Não informado'}
• Incoterm: ${dados.incoterm || 'FOB'}
• Container: ${dados.container || 'Não informado'}

💰 *Valores:*
• Valor ${dados.incoterm || 'FOB'}: ${formatCurrency(dados.valor_fob, 'USD')}
• CIF Total: ${formatCurrency(resultados.cif)}
• *Custo Final: ${formatCurrency(resultados.custo_final)}*

📄 *Relatório Completo:*
${pdfUrl}

Estou à disposição para esclarecer qualquer dúvida!

${userName ? 'Atenciosamente,\n' + userName : 'Equipe Maritime Cost Guru'}`;
};

/**
 * Gera assunto para email de orçamento
 */
export const generateShipmentEmailSubject = (clientName: string, calculationName: string): string => {
  return `Orçamento de Importação Marítima - ${clientName} - ${calculationName}`;
};

/**
 * Gera corpo do email para orçamento
 */
export const generateShipmentEmailBody = (data: ShipmentTemplateData): string => {
  const { clientName, calculationName, userName = '', dados, resultados, pdfUrl } = data;
  
  return `Prezado(a) ${clientName},

Espero que esteja bem.

Segue em anexo o orçamento detalhado para sua operação de importação marítima.

RESUMO DA OPERAÇÃO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cálculo: ${calculationName}
Produto: ${dados.produto || 'Não informado'}
Origem: ${dados.origem || 'Não informado'}
Destino: ${dados.destino || 'Não informado'}
Incoterm: ${dados.incoterm || 'FOB'}
Container: ${dados.container || 'Não informado'}

VALORES PRINCIPAIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valor ${dados.incoterm || 'FOB'}: ${formatCurrency(dados.valor_fob, 'USD')}
CIF Total: ${formatCurrency(resultados.cif)}
Custo Final Estimado: ${formatCurrency(resultados.custo_final)}

RELATÓRIO DETALHADO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Para visualizar o relatório completo em PDF, acesse:
${pdfUrl}

OBSERVAÇÕES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Os valores apresentados são estimativas baseadas nas informações fornecidas
• Custos reais podem variar conforme cotações do mercado e procedimentos específicos
• Este orçamento tem validade de 30 dias
• Para prosseguir com a operação, entre em contato para confirmarmos os detalhes

Estou à disposição para esclarecer qualquer dúvida e dar andamento ao processo.

${userName ? 'Atenciosamente,\n\n' + userName : 'Atenciosamente,\n\nEquipe Maritime Cost Guru'}`;
};

/**
 * Gera resumo curto para logging
 */
export const generateShipmentSummary = (data: ShipmentTemplateData): string => {
  const { clientName, calculationName, resultados } = data;
  
  return `${calculationName} para ${clientName} - Custo Final: ${formatCurrency(resultados.custo_final)}`;
};

/**
 * Valida se os dados necessários estão presentes para envio
 */
export const validateShipmentData = (data: ShipmentTemplateData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.clientName?.trim()) {
    errors.push('Nome do cliente é obrigatório');
  }
  
  if (!data.calculationName?.trim()) {
    errors.push('Nome do cálculo é obrigatório');
  }
  
  if (!data.pdfUrl?.trim()) {
    errors.push('URL do PDF é obrigatória');
  }
  
  if (!data.dados) {
    errors.push('Dados da importação são obrigatórios');
  }
  
  if (!data.resultados) {
    errors.push('Resultados do cálculo são obrigatórios');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};