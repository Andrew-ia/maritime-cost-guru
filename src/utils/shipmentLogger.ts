/**
 * Sistema de logging para rastreamento de envios de orçamentos
 */

import { supabase } from '@/lib/supabase';

export type ShipmentChannel = 'whatsapp' | 'email';
export type ShipmentStatus = 'sent' | 'failed' | 'pending';

export interface ShipmentLogData {
  calculationId: string;
  clientId: string;
  channel: ShipmentChannel;
  status: ShipmentStatus;
  pdfUrl: string;
  summary: string;
  errorMessage?: string;
}

export interface ShipmentLogRecord extends ShipmentLogData {
  id: string;
  userId: string;
  sentAt: string;
  createdAt: string;
}

/**
 * Registra um envio de orçamento no log
 */
export const logShipment = async (data: ShipmentLogData): Promise<ShipmentLogRecord | null> => {
  try {
    const { data: result, error } = await supabase
      .from('shipment_logs')
      .insert({
        calculation_id: data.calculationId,
        client_id: data.clientId,
        channel: data.channel,
        status: data.status,
        pdf_url: data.pdfUrl,
        summary: data.summary,
        error_message: data.errorMessage,
        sent_at: data.status === 'sent' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao registrar envio:', error);
      return null;
    }

    return {
      id: result.id,
      calculationId: result.calculation_id,
      clientId: result.client_id,
      userId: result.user_id,
      channel: result.channel,
      status: result.status,
      pdfUrl: result.pdf_url,
      summary: result.summary,
      errorMessage: result.error_message,
      sentAt: result.sent_at,
      createdAt: result.created_at
    };
  } catch (error) {
    console.error('Erro inesperado ao registrar envio:', error);
    return null;
  }
};

/**
 * Atualiza o status de um envio existente
 */
export const updateShipmentStatus = async (
  shipmentId: string, 
  status: ShipmentStatus, 
  errorMessage?: string
): Promise<boolean> => {
  try {
    const updateData: any = {
      status,
      error_message: errorMessage
    };

    // Se mudou para 'sent', atualiza o timestamp
    if (status === 'sent') {
      updateData.sent_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('shipment_logs')
      .update(updateData)
      .eq('id', shipmentId);

    if (error) {
      console.error('Erro ao atualizar status do envio:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro inesperado ao atualizar status:', error);
    return false;
  }
};

/**
 * Lista envios de um cálculo específico
 */
export const getCalculationShipments = async (calculationId: string): Promise<ShipmentLogRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('shipment_logs')
      .select('*')
      .eq('calculation_id', calculationId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar envios:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      calculationId: record.calculation_id,
      clientId: record.client_id,
      userId: record.user_id,
      channel: record.channel,
      status: record.status,
      pdfUrl: record.pdf_url,
      summary: record.summary,
      errorMessage: record.error_message,
      sentAt: record.sent_at,
      createdAt: record.created_at
    }));
  } catch (error) {
    console.error('Erro inesperado ao buscar envios:', error);
    return [];
  }
};

/**
 * Lista envios de um cliente específico
 */
export const getClientShipments = async (clientId: string): Promise<ShipmentLogRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('shipment_logs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar envios do cliente:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      calculationId: record.calculation_id,
      clientId: record.client_id,
      userId: record.user_id,
      channel: record.channel,
      status: record.status,
      pdfUrl: record.pdf_url,
      summary: record.summary,
      errorMessage: record.error_message,
      sentAt: record.sent_at,
      createdAt: record.created_at
    }));
  } catch (error) {
    console.error('Erro inesperado ao buscar envios do cliente:', error);
    return [];
  }
};

/**
 * Lista envios recentes do usuário atual
 */
export const getRecentShipments = async (limit: number = 10): Promise<ShipmentLogRecord[]> => {
  try {
    const { data, error } = await supabase
      .from('shipment_logs')
      .select(`
        *,
        client:clients(name),
        calculation:calculations_history(calculation_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar envios recentes:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      calculationId: record.calculation_id,
      clientId: record.client_id,
      userId: record.user_id,
      channel: record.channel,
      status: record.status,
      pdfUrl: record.pdf_url,
      summary: record.summary,
      errorMessage: record.error_message,
      sentAt: record.sent_at,
      createdAt: record.created_at
    }));
  } catch (error) {
    console.error('Erro inesperado ao buscar envios recentes:', error);
    return [];
  }
};

/**
 * Verifica se um cálculo já foi enviado recentemente
 */
export const hasRecentShipment = async (
  calculationId: string, 
  channel: ShipmentChannel, 
  minutesAgo: number = 5
): Promise<boolean> => {
  try {
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('shipment_logs')
      .select('id')
      .eq('calculation_id', calculationId)
      .eq('channel', channel)
      .eq('status', 'sent')
      .gte('sent_at', cutoffTime)
      .limit(1);

    if (error) {
      console.error('Erro ao verificar envios recentes:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Erro inesperado ao verificar envios recentes:', error);
    return false;
  }
};

/**
 * Estatísticas de envios
 */
export const getShipmentStats = async (): Promise<{
  total: number;
  byChannel: Record<ShipmentChannel, number>;
  byStatus: Record<ShipmentStatus, number>;
  today: number;
}> => {
  try {
    const { data, error } = await supabase
      .from('shipment_logs')
      .select('channel, status, created_at');

    if (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        total: 0,
        byChannel: { whatsapp: 0, email: 0 },
        byStatus: { sent: 0, failed: 0, pending: 0 },
        today: 0
      };
    }

    const logs = data || [];
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
      total: logs.length,
      byChannel: { whatsapp: 0, email: 0 } as Record<ShipmentChannel, number>,
      byStatus: { sent: 0, failed: 0, pending: 0 } as Record<ShipmentStatus, number>,
      today: 0
    };

    logs.forEach(log => {
      stats.byChannel[log.channel as ShipmentChannel]++;
      stats.byStatus[log.status as ShipmentStatus]++;
      
      if (log.created_at.startsWith(today)) {
        stats.today++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Erro inesperado ao buscar estatísticas:', error);
    return {
      total: 0,
      byChannel: { whatsapp: 0, email: 0 },
      byStatus: { sent: 0, failed: 0, pending: 0 },
      today: 0
    };
  }
};