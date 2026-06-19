import ModernLanding from './modern/ModernLanding';
import MinimalLanding from './minimal/MinimalLanding';
import CorporateLanding from './corporate/CorporateLanding';
import BoldLanding from './bold/BoldLanding';
import StudioLanding from './studio/StudioLanding';

export const PARTNER_TEMPLATE_LANDINGS = {
  modern: ModernLanding,
  minimal: MinimalLanding,
  corporate: CorporateLanding,
  bold: BoldLanding,
  studio: StudioLanding,
};

export const PARTNER_TEMPLATE_IDS = Object.keys(PARTNER_TEMPLATE_LANDINGS);

export function getPartnerTemplateLanding(templateId) {
  return PARTNER_TEMPLATE_LANDINGS[templateId] || ModernLanding;
}
