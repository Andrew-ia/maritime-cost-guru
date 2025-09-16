import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import { 
  openWhatsApp, 
  openEmail, 
  generateWhatsAppMessage, 
  generateEmailSubject, 
  generateEmailBody,
  isValidPhoneForWhatsApp,
  isValidEmail,
  ContactTemplateData
} from '@/utils/contact';

interface ContactButtonsProps {
  clientName: string;
  phone?: string;
  email?: string;
  userName?: string;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const ContactButtons = ({ 
  clientName, 
  phone, 
  email, 
  userName,
  size = 'sm',
  className = ''
}: ContactButtonsProps) => {
  const templateData: ContactTemplateData = {
    clientName,
    userName
  };

  const handleWhatsAppClick = () => {
    if (!phone || !isValidPhoneForWhatsApp(phone)) return;
    
    const message = generateWhatsAppMessage(templateData);
    openWhatsApp(phone, message);
  };

  const handleEmailClick = () => {
    if (!email || !isValidEmail(email)) return;
    
    const subject = generateEmailSubject(clientName);
    const body = generateEmailBody(templateData);
    openEmail(email, subject, body);
  };

  // Se não tem telefone válido, não renderiza nada
  if (!isValidPhoneForWhatsApp(phone || '')) {
    return null;
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {/* Botão WhatsApp */}
      {isValidPhoneForWhatsApp(phone || '') && (
        <Button
          size={size}
          variant="outline"
          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
          onClick={handleWhatsAppClick}
          title={`Enviar WhatsApp para ${clientName}`}
        >
          <MessageCircle className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

export default ContactButtons;