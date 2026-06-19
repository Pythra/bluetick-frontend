/** Google Font families loaded per partner template */
export const TEMPLATE_FONT_STACKS = {
  modern: {
    body: "'DM Sans', sans-serif",
    display: "'Fraunces', serif",
    url: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&display=swap',
  },
  minimal: {
    body: "'Inter', sans-serif",
    display: "'Cormorant Garamond', serif",
    url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap',
  },
  corporate: {
    body: "'IBM Plex Sans', sans-serif",
    display: "'Source Serif 4', serif",
    url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&display=swap',
  },
  bold: {
    body: "'Manrope', sans-serif",
    display: "'Syne', sans-serif",
    url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap',
  },
  studio: {
    body: "'Work Sans', sans-serif",
    display: "'Libre Baskerville', serif",
    url: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@400;500;600;700&display=swap',
  },
};

export function applyTemplateFonts(templateId) {
  const stack = TEMPLATE_FONT_STACKS[templateId] || TEMPLATE_FONT_STACKS.modern;
  const root = document.documentElement;
  root.style.setProperty('--tpl-font-body', stack.body);
  root.style.setProperty('--tpl-font-display', stack.display);

  let link = document.getElementById('partner-template-fonts');
  if (!link) {
    link = document.createElement('link');
    link.id = 'partner-template-fonts';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = stack.url;
}

export function clearTemplateFonts() {
  document.documentElement.style.removeProperty('--tpl-font-body');
  document.documentElement.style.removeProperty('--tpl-font-display');
  document.getElementById('partner-template-fonts')?.remove();
}
