import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, Send, Loader2, Share2 } from 'lucide-react';
import { DadosImportacao, ResultadosCalculados } from '@/pages/Index';
import { generateAndUploadPDF } from '@/utils/pdfStorage';
import { 
  generateShipmentWhatsAppMessage, 
  generateShipmentEmailSubject, 
  generateShipmentEmailBody,
  generateShipmentSummary,
  validateShipmentData,
  ShipmentTemplateData
} from '@/utils/shipmentTemplates';
import {
  formatPhoneForWhatsApp,
  isValidPhoneForWhatsApp,
  isValidEmail
} from '@/utils/contact';
import { logShipment, hasRecentShipment } from '@/utils/shipmentLogger';

interface ShipmentButtonsProps {
  calculationId: string;
  calculationName: string;
  client?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
  };
  dados: DadosImportacao;
  resultados: ResultadosCalculados;
  userName?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ShipmentButtons = ({ 
  calculationId,
  calculationName,
  client,
  dados, 
  resultados,
  userName,
  size = 'sm',
  className = ''
}: ShipmentButtonsProps) => {
  const [loading, setLoading] = useState<'whatsapp' | 'email' | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Se não tem cliente associado, não renderiza nada
  if (!client) {
    return null;
  }

  const hasValidPhone = isValidPhoneForWhatsApp(client.phone || '');
  
  // Debug: verificar dados do cliente
  console.log('ShipmentButtons Debug:', {
    clientName: client.name,
    clientPhone: client.phone,
    hasValidPhone,
    calculationId
  });

  // Se não tem telefone válido, não renderiza nada
  if (!hasValidPhone) {
    console.log('ShipmentButtons: Não renderizando - telefone inválido');
    return null;
  }

  const generatePDFAndTemplateData = async (): Promise<ShipmentTemplateData | null> => {
    try {
      // Gerar e fazer upload do PDF
      const pdfUrl = await generateAndUploadPDF(
        dados,
        resultados,
        calculationId,
        calculationName
      );

      // Preparar dados do template
      const templateData: ShipmentTemplateData = {
        clientName: client.name,
        calculationName,
        userName: userName || user?.email?.split('@')[0] || '',
        pdfUrl,
        dados,
        resultados
      };

      // Validar dados
      const validation = validateShipmentData(templateData);
      if (!validation.isValid) {
        throw new Error(`Dados inválidos: ${validation.errors.join(', ')}`);
      }

      return templateData;
    } catch (error) {
      console.error('Erro ao gerar PDF e dados do template:', error);
      throw error;
    }
  };

  const handleWhatsAppShipment = async () => {
    if (!hasValidPhone || loading) return;

    setLoading('whatsapp');
    
    try {
      // Verificar se já foi enviado recentemente
      const recentShipment = await hasRecentShipment(calculationId, 'whatsapp', 5);
      if (recentShipment) {
        toast({
          title: 'Envio recente detectado',
          description: 'Este orçamento já foi enviado via WhatsApp nos últimos 5 minutos.',
          variant: 'destructive',
        });
        return;
      }

      // Gerar PDF e dados do template
      const templateData = await generatePDFAndTemplateData();
      if (!templateData) return;

      // Gerar mensagem do WhatsApp
      const message = generateShipmentWhatsAppMessage(templateData);
      
      // Log do envio (status pending)
      const logRecord = await logShipment({
        calculationId,
        clientId: client.id,
        channel: 'whatsapp',
        status: 'pending',
        pdfUrl: templateData.pdfUrl,
        summary: generateShipmentSummary(templateData)
      });

      // Abrir WhatsApp
      const formattedPhone = formatPhoneForWhatsApp(client.phone!);
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');

      // Assumir sucesso (não temos como verificar se o usuário realmente enviou)
      if (logRecord) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay para simular envio
        // Atualizar status para 'sent' após abrir o WhatsApp
        // Note: Em uma implementação real, isso poderia ser feito via callback ou webhook
      }

      toast({
        title: 'WhatsApp aberto',
        description: `Mensagem preparada para ${client.name}. Complete o envio no WhatsApp.`,
      });

    } catch (error: any) {
      console.error('Erro ao enviar via WhatsApp:', error);
      
      // Log do erro
      await logShipment({
        calculationId,
        clientId: client.id,
        channel: 'whatsapp',
        status: 'failed',
        pdfUrl: '',
        summary: `Falha no envio para ${client.name}`,
        errorMessage: error.message
      });

      toast({
        title: 'Erro no WhatsApp',
        description: error.message || 'Não foi possível preparar o envio',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const handleEmailShipment = async () => {
    if (!hasValidEmail || loading) return;

    setLoading('email');
    
    try {
      // Verificar se já foi enviado recentemente
      const recentShipment = await hasRecentShipment(calculationId, 'email', 5);
      if (recentShipment) {
        toast({
          title: 'Envio recente detectado',
          description: 'Este orçamento já foi enviado via email nos últimos 5 minutos.',
          variant: 'destructive',
        });
        return;
      }

      // Gerar PDF e dados do template
      const templateData = await generatePDFAndTemplateData();
      if (!templateData) return;

      // Gerar conteúdo do email
      const subject = generateShipmentEmailSubject(client.name, calculationName);
      const body = generateShipmentEmailBody(templateData);
      
      // Log do envio (status pending)
      const logRecord = await logShipment({
        calculationId,
        clientId: client.id,
        channel: 'email',
        status: 'pending',
        pdfUrl: templateData.pdfUrl,
        summary: generateShipmentSummary(templateData)
      });

      // Abrir cliente de email
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);
      const emailUrl = `mailto:${client.email}?subject=${encodedSubject}&body=${encodedBody}`;
      
      window.location.href = emailUrl;

      // Assumir sucesso (não temos como verificar se o usuário realmente enviou)
      if (logRecord) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay para simular envio
      }

      toast({
        title: 'Email preparado',
        description: `Cliente de email aberto para ${client.name}. Complete o envio no seu cliente de email.`,
      });

    } catch (error: any) {
      console.error('Erro ao enviar via email:', error);
      
      // Log do erro
      await logShipment({
        calculationId,
        clientId: client.id,
        channel: 'email',
        status: 'failed',
        pdfUrl: '',
        summary: `Falha no envio para ${client.name}`,
        errorMessage: error.message
      });

      toast({
        title: 'Erro no email',
        description: error.message || 'Não foi possível preparar o envio',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {/* Botão WhatsApp */}
      {hasValidPhone && (
        <Button
          size={size}
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          onClick={handleWhatsAppShipment}
          disabled={loading !== null}
          title={`Enviar orçamento via WhatsApp para ${client.name}`}
        >
          {loading === 'whatsapp' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <MessageCircle className="w-3 h-3" />
          )}
          {size !== 'sm' && <span className="ml-1">WhatsApp</span>}
        </Button>
      )}
      
      {/* Botão Email */}
      {hasValidEmail && (
        <Button
          size={size}
          variant="outline"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
          onClick={handleEmailShipment}
          disabled={loading !== null}
          title={`Enviar orçamento via email para ${client.name}`}
        >
          {loading === 'email' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          {size !== 'sm' && <span className="ml-1">Email</span>}
        </Button>
      )}
    </div>
  );
};

export default ShipmentButtons;