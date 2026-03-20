import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!client || !twilioNumber) {
    console.warn('Twilio no está configurado. Mensaje no enviado:', message);
    return { success: false, error: 'Twilio no configurado' };
  }

  try {
    // Asegurarse de que el número tenga el formato correcto para WhatsApp
    // Twilio requiere el formato 'whatsapp:+[código de país][número]'
    const formattedNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to.startsWith('+') ? to : `+${to}`}`;
    
    const response = await client.messages.create({
      body: message,
      from: twilioNumber.startsWith('whatsapp:') ? twilioNumber : `whatsapp:${twilioNumber}`,
      to: formattedNumber
    });

    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error('Error al enviar mensaje de WhatsApp:', error);
    return { success: false, error: 'Error al enviar el mensaje' };
  }
}
