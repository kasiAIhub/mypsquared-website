const WHATSAPP_PHONE = "27818905861";
const WHATSAPP_BASE_URL = "https://api.whatsapp.com/send";

const sanitizePhoneNumber = (phone: string) => phone.replace(/\D/g, "");

const isEmbeddedContext = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

const openExternalUrl = (url: string) => {
  if (typeof window === "undefined") {
    return false;
  }

  if (isEmbeddedContext()) {
    try {
      if (window.top) {
        window.top.location.href = url;
        return true;
      }
    } catch (error) {
      console.warn("Failed to open WhatsApp in the top window:", error);
    }
  }

  const popup = window.open(url, "_blank", "noopener,noreferrer");

  if (popup && !popup.closed) {
    popup.opener = null;
    return true;
  }

  try {
    window.location.assign(url);
    return true;
  } catch (error) {
    console.error("Failed to open external URL:", error);
  }

  return false;
};

export const WHATSAPP_DISPLAY_PHONE = "+27 81 890 5861";
export const DEFAULT_WHATSAPP_MESSAGE = "Hi P-Squared! I'd like to learn more about homeschooling.";

export const getWhatsAppFallbackHref = (phone: string = WHATSAPP_PHONE) => `tel:+${sanitizePhoneNumber(phone)}`;

export const getWhatsAppUrl = (message: string, phone: string = WHATSAPP_PHONE) => {
  const sanitizedPhone = sanitizePhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);

  return `${WHATSAPP_BASE_URL}?phone=${sanitizedPhone}&text=${encodedMessage}`;
};

export const openWhatsApp = (message: string = DEFAULT_WHATSAPP_MESSAGE, phone: string = WHATSAPP_PHONE) => {
  const targetUrl = getWhatsAppUrl(message, phone);

  try {
    if (openExternalUrl(targetUrl)) {
      return;
    }
  } catch (error) {
    console.error("Failed to open WhatsApp link:", error);
  }

  if (typeof window !== "undefined") {
    window.location.href = getWhatsAppFallbackHref(phone);
    return;
  }
};
