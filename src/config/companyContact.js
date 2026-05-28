/**
 * Company WhatsApp lines (wa.me uses country code + number, no + or spaces).
 */
export const companyWhatsappNumbers = [
  { display: '+234 906 943 1949', waMe: '2349069431949' },
  { display: '+234 913 883 2111', waMe: '2349138832111' },
];

/** Primary line for demo / sales inquiries */
export const companyWhatsappDemoUrl = `https://wa.me/${companyWhatsappNumbers[0].waMe}?text=${encodeURIComponent("Hi, I'd like to book a demo.")}`;
