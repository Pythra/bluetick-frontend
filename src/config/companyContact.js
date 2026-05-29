/**
 * Company WhatsApp lines (wa.me uses country code + number, no + or spaces).
 */
export const companyWhatsappNumbers = [
  { display: '+234 906 943 1949', waMe: '2349069431949' },
  { display: '+234 913 883 2111', waMe: '2349138832111' },
];

/** Demo / sales — line ending in 111 (+234 913 883 2111) */
export const companyWhatsappDemoLine =
  companyWhatsappNumbers.find((n) => n.waMe.endsWith('111')) ?? companyWhatsappNumbers[1];

export const companyWhatsappDemoDisplay = companyWhatsappDemoLine.display;

export const companyWhatsappDemoUrl = `https://wa.me/${companyWhatsappDemoLine.waMe}?text=${encodeURIComponent("Hi, I'd like to book a demo.")}`;

export const companyWhatsappSessionUrl = `https://wa.me/${companyWhatsappDemoLine.waMe}?text=${encodeURIComponent("Hi, I'd like to book a startup consultation session.")}`;
